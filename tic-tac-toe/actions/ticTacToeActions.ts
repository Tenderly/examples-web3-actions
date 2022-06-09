import { ActionFn, Context, Event, TransactionEvent } from "@tenderly/actions";
import { ethers } from "ethers";
import TicTacToe from "./TicTacToe.json";

export type Game = {
    players: { [address: string]: number };
    board: number[][];
};

export const newGameAction: ActionFn = async (
    context: Context,
    event: Event
) => {
    let txEvent = event as TransactionEvent;

    let iface = new ethers.utils.Interface(TicTacToe.abi);

    const result = iface.decodeEventLog(
        "GameCreated",
        txEvent.logs[0].data,
        txEvent.logs[0].topics
    );

    const { gameId, playerNumber, player } = result;
    console.log("Game Created Event:", {
        gameId: gameId.toString(),
        playerNumber,
        player,
    });

    const game: Game = createNewGame();
    await context.storage.putJson(gameId.toString(), game);
};

const createNewGame = (): Game => {
    return {
        players: {},
        board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    };
};

export const playerJoinedAction: ActionFn = async (
    context: Context,
    event: Event
) => {
    let txEvent = event as TransactionEvent;
    let iface = new ethers.utils.Interface(TicTacToe.abi);
    const result = iface.decodeEventLog(
        "PlayerJoinedGame",
        txEvent.logs[0].data,
        txEvent.logs[0].topics
    );

    const gameId = result.gameId.toString();
    const playerAddress = result.player.toLowerCase() as string;
    const playerNumber = result.playerNumber;

    console.log("Player joined event:", {
        gameId,
        playerAddress,
        playerNumber,
    });

    const game: Game = (await context.storage.getJson(gameId)) as Game;
    game.players[playerAddress] = playerNumber;

    await context.storage.putJson(result.gameId.toString(), game);
};

export const playerMadeMoveAction: ActionFn = async (
    context: Context,
    event: Event
) => {
    let txEvent = event as TransactionEvent;
    let iface = new ethers.utils.Interface(TicTacToe.abi);
    const result = iface.decodeEventLog(
        "PlayerMadeMove",
        txEvent.logs[0].data,
        txEvent.logs[0].topics
    );

    const gameId = result.gameId.toString();
    const game = (await context.storage.getJson(gameId)) as Game;
    const player = result.player.toLowerCase() as string;
    const { boardRow, boardCol } = result;

    console.log("Player's move event log:", {
        gameId,
        player,
        boardRow: boardRow.toString(),
        boardCol: boardCol.toString(),
    });

    game.board[boardRow][boardCol] = game.players[player];

    await context.storage.putJson(gameId, game);

    processNewGameState(game);
};

export const gameOverAction: ActionFn = async (
    context: Context,
    event: Event
) => {
    let txEvent = event as TransactionEvent;
    let iface = new ethers.utils.Interface(TicTacToe.abi);

    const gameOverTopic = iface.getEventTopic("GameOver");
    const gameOverLog = txEvent.logs.find(
        (log) =>
            log.topics.find((topic) => topic == gameOverTopic) !== undefined
    );

    if (gameOverLog == undefined) {
        // impossible
        throw Error("GameOver log present.");
    }

    const result = iface.decodeEventLog(
        "GameOver",
        gameOverLog.data,
        gameOverLog.topics
    );

    console.log(result);

    const gameId = result.gameId.toString();
    const winner = result.winner as number;

    const winnerMessage = getWinnerMessage(winner);
    console.info(`Game ${gameId}: ${winnerMessage}`);
};

const getWinnerMessage = (winner: number) => {
    if (winner == 3) {
        return "⚖️ It's a draw.";
    }
    return `🎉 Winner of the game is ${winner}`;
};

const processNewGameState = (game: Game) => {
    let board = "\n";
    game.board.forEach((row) => {
        row.forEach((field) => {
            if (field == 1) {
                board += "❎ ";
                return;
            }

            if (field == 2) {
                board += "🅾️ ";
                return;
            }

            board += "💜 ";
        });

        board += "\n";
    });

    console.log(board);
};
