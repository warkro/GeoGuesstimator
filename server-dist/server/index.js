import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import {} from '../shared/multiplayer.js';
import { roundPack } from '../shared/rounds.js';
import { scoreRound } from '../shared/scoring.js';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: process.env.NODE_ENV === 'production'
        ? undefined
        : {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        },
});
const sessions = new Map();
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const clientDistPath = resolve(process.cwd(), 'dist');
app.use(express.json());
app.get('/api/health', (_request, response) => {
    response.json({ ok: true, activeSessions: sessions.size });
});
app.post('/api/sessions', (request, response) => {
    const body = request.body;
    const name = sanitizeName(body?.name);
    if (!name) {
        response.status(400).json({ error: 'Enter a host name before creating a session.' });
        return;
    }
    const code = generateCode();
    const playerId = randomUUID();
    const hostPlayer = {
        id: playerId,
        name,
        isHost: true,
        connected: false,
        joinedAt: Date.now(),
        totalScore: 0,
        roundResults: [],
    };
    sessions.set(code, {
        code,
        hostId: playerId,
        phase: 'lobby',
        roundIndex: 0,
        rounds: roundPack,
        players: new Map([[playerId, hostPlayer]]),
        submissions: new Map(),
        revealResults: [],
    });
    const payload = { code, playerId };
    response.status(201).json(payload);
});
app.post('/api/sessions/:code/join', (request, response) => {
    const code = normalizeCode(request.params.code);
    const session = sessions.get(code);
    if (!session) {
        response.status(404).json({ error: 'That session code was not found.' });
        return;
    }
    if (session.phase !== 'lobby') {
        response.status(409).json({ error: 'This session has already started.' });
        return;
    }
    const body = request.body;
    const name = sanitizeName(body?.name);
    if (!name) {
        response.status(400).json({ error: 'Enter a player name before joining.' });
        return;
    }
    const playerId = randomUUID();
    const player = {
        id: playerId,
        name,
        isHost: false,
        connected: false,
        joinedAt: Date.now(),
        totalScore: 0,
        roundResults: [],
    };
    session.players.set(playerId, player);
    const payload = { code, playerId };
    response.status(201).json(payload);
});
if (existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get(/^(?!\/api|\/socket\.io).*/, (_request, response) => {
        response.sendFile(resolve(clientDistPath, 'index.html'));
    });
}
io.use((socket, next) => {
    const { code, playerId } = socket.handshake.auth;
    const normalizedCode = normalizeCode(code);
    if (!normalizedCode || !playerId) {
        next(new Error('Missing session credentials.'));
        return;
    }
    const session = sessions.get(normalizedCode);
    if (!session || !session.players.has(playerId)) {
        next(new Error('Session credentials are no longer valid.'));
        return;
    }
    socket.data.code = normalizedCode;
    socket.data.playerId = playerId;
    next();
});
io.on('connection', (socket) => {
    const code = socket.data.code;
    const playerId = socket.data.playerId;
    const session = sessions.get(code);
    if (!session) {
        socket.disconnect();
        return;
    }
    const player = session.players.get(playerId);
    if (!player) {
        socket.disconnect();
        return;
    }
    player.connected = true;
    socket.join(code);
    emitSnapshot(session);
    socket.on('session:start', () => {
        const currentSession = sessions.get(code);
        if (!currentSession || currentSession.hostId !== playerId || currentSession.phase !== 'lobby') {
            socket.emit('session:error', 'Only the host can start a lobby session.');
            return;
        }
        currentSession.phase = 'guessing';
        currentSession.roundIndex = 0;
        currentSession.submissions.clear();
        currentSession.revealResults = [];
        emitSnapshot(currentSession);
    });
    socket.on('round:submit', (payload) => {
        const currentSession = sessions.get(code);
        if (!currentSession || currentSession.phase !== 'guessing') {
            socket.emit('session:error', 'This round is not accepting submissions right now.');
            return;
        }
        const round = getCurrentRound(currentSession);
        if (!round) {
            socket.emit('session:error', 'No active round was found for this session.');
            return;
        }
        if (!isValidCoordinates(payload?.guess) || !isValidSituationIndex(payload?.selectedSituationIndex, round)) {
            socket.emit('session:error', 'Submit a valid map guess and one story choice.');
            return;
        }
        currentSession.submissions.set(playerId, {
            guess: payload.guess,
            selectedSituationIndex: payload.selectedSituationIndex,
        });
        emitSnapshot(currentSession);
    });
    socket.on('round:reveal', () => {
        const currentSession = sessions.get(code);
        if (!currentSession || currentSession.hostId !== playerId || currentSession.phase !== 'guessing') {
            socket.emit('session:error', 'Only the host can reveal an active round.');
            return;
        }
        resolveRound(currentSession);
        emitSnapshot(currentSession);
    });
    socket.on('round:advance', () => {
        const currentSession = sessions.get(code);
        if (!currentSession || currentSession.hostId !== playerId || currentSession.phase !== 'reveal') {
            socket.emit('session:error', 'Only the host can advance after a reveal.');
            return;
        }
        const nextRoundIndex = currentSession.roundIndex + 1;
        if (nextRoundIndex >= currentSession.rounds.length) {
            currentSession.phase = 'complete';
            emitSnapshot(currentSession);
            return;
        }
        currentSession.roundIndex = nextRoundIndex;
        currentSession.phase = 'guessing';
        currentSession.submissions.clear();
        currentSession.revealResults = [];
        emitSnapshot(currentSession);
    });
    socket.on('disconnect', () => {
        const currentSession = sessions.get(code);
        const currentPlayer = currentSession?.players.get(playerId);
        if (!currentSession || !currentPlayer) {
            return;
        }
        currentPlayer.connected = false;
        emitSnapshot(currentSession);
    });
});
const port = Number(process.env.PORT ?? 3001);
httpServer.listen(port, () => {
    console.log(`GeoGuesstimator multiplayer server listening on ${port}`);
});
function resolveRound(session) {
    const round = getCurrentRound(session);
    if (!round) {
        return;
    }
    const revealResults = sortPlayers(session.players).map((player) => {
        const submission = session.submissions.get(player.id);
        if (!submission) {
            const emptyResult = {
                playerId: player.id,
                playerName: player.name,
                guess: null,
                selectedSituationIndex: null,
                correctSituationIndex: round.correctSituationIndex,
                isSituationCorrect: false,
                distanceKm: null,
                locationPoints: 0,
                situationPoints: 0,
                totalPoints: 0,
            };
            player.roundResults.push(emptyResult);
            return emptyResult;
        }
        const isSituationCorrect = submission.selectedSituationIndex === round.correctSituationIndex;
        const scored = scoreRound(submission.guess, round.answer, isSituationCorrect);
        const roundResult = {
            playerId: player.id,
            playerName: player.name,
            guess: submission.guess,
            selectedSituationIndex: submission.selectedSituationIndex,
            correctSituationIndex: round.correctSituationIndex,
            isSituationCorrect,
            distanceKm: scored.distanceKm,
            locationPoints: scored.locationPoints,
            situationPoints: scored.situationPoints,
            totalPoints: scored.totalPoints,
        };
        player.totalScore += roundResult.totalPoints;
        player.roundResults.push(roundResult);
        return roundResult;
    });
    session.revealResults = revealResults;
    session.submissions.clear();
    session.phase = session.roundIndex === session.rounds.length - 1 ? 'complete' : 'reveal';
}
function emitSnapshot(session) {
    io.to(session.code).emit('session:snapshot', buildSnapshot(session));
}
function buildSnapshot(session) {
    const currentRound = getCurrentRound(session);
    const revealVisible = session.phase === 'reveal' || session.phase === 'complete';
    return {
        code: session.code,
        phase: session.phase,
        roundIndex: session.roundIndex,
        totalRounds: session.rounds.length,
        hostId: session.hostId,
        playerCount: session.players.size,
        submittedCount: session.submissions.size,
        currentRound: currentRound ? buildRoundView(currentRound, revealVisible) : null,
        leaderboard: sortPlayers(session.players).map((player) => buildPlayerSummary(session, player.id)),
        revealResults: session.revealResults,
    };
}
function buildRoundView(round, revealVisible) {
    return {
        id: round.id,
        title: round.title,
        hint: round.hint,
        clue: round.clue,
        situationPrompt: round.situationPrompt,
        situationOptions: round.situationOptions,
        imageUrl: round.imageUrl,
        ...(revealVisible
            ? {
                locationName: round.locationName,
                story: round.story,
                answer: round.answer,
                correctSituationIndex: round.correctSituationIndex,
            }
            : {}),
    };
}
function buildPlayerSummary(session, playerId) {
    const player = session.players.get(playerId);
    if (!player) {
        throw new Error(`Missing player ${playerId}`);
    }
    return {
        id: player.id,
        name: player.name,
        isHost: player.isHost,
        isConnected: player.connected,
        totalScore: player.totalScore,
        submittedRound: session.phase === 'guessing' ? session.submissions.has(player.id) : false,
        lastRoundPoints: player.roundResults.at(-1)?.totalPoints ?? null,
    };
}
function getCurrentRound(session) {
    return session.rounds[session.roundIndex] ?? null;
}
function sortPlayers(players) {
    return [...players.values()].sort((left, right) => {
        if (right.totalScore !== left.totalScore) {
            return right.totalScore - left.totalScore;
        }
        return left.joinedAt - right.joinedAt;
    });
}
function sanitizeName(value) {
    const trimmed = value?.trim().replace(/\s+/g, ' ') ?? '';
    return trimmed.slice(0, 24);
}
function normalizeCode(value) {
    return value?.trim().toUpperCase() ?? '';
}
function generateCode() {
    let candidate;
    do {
        candidate = Array.from({ length: 5 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
    } while (sessions.has(candidate));
    return candidate;
}
function isValidCoordinates(value) {
    if (!value) {
        return false;
    }
    return Number.isFinite(value.lat) && Number.isFinite(value.lng) && Math.abs(value.lat) <= 90 && Math.abs(value.lng) <= 180;
}
function isValidSituationIndex(value, round) {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < round.situationOptions.length;
}
