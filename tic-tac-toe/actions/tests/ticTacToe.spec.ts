import { TransactionEvent } from "@tenderly/actions";
import { TestRuntime } from "@tenderly/actions-test";
import { expect } from "chai";
import {
    newGameAction,
    playerJoinedAction,
    playerMadeMoveAction,
} from "../ticTacToeActions";
const testEvents = {
    newGame: {
        network: "3",
        blockHash:
            "0xa2dd5faea09715bdd020ef9090e170fff12140bc97d7f4ec9f8bcf8b0aaf3cc2",
        blockNumber: 12339873,
        hash: "0x8ca1f4b306bba7a7fb5d8a81c789003d5b3a20ab1989c15cf8e1b569bd7b9a20",
        from: "0xeDed260BFDCDf6Dc0f564b3e4AB5CeA805bBA10B",
        to: "0x1eb7DBd296eB3FC08B2b6217d87E6Bf3CB6e42dF",
        logs: [
            {
                address: "0x1eb7DBd296eB3FC08B2b6217d87E6Bf3CB6e42dF",
                topics: [
                    "0xc3e0f84839dc888c892a013d10c8f9d6dc05a21a879d0ce468ca558013e9121c",
                ],
                data: "0x000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000eded260bfdcdf6dc0f564b3e4ab5cea805bba10b",
            },
        ],
        input: "0x7d03f5f3",
        value: "0x0",
        nonce: "0xd",
        gas: "0x17d41",
        gasUsed: "0x17d41",
        cumulativeGasUsed: "0x17d41",
        gasPrice: "0x9502f907",
        gasTipCap: "0x9502f900",
        gasFeeCap: "0x9502f90e",
        alertId: null,
    },
    player1Joined: {
        network: "3",
        blockHash:
            "0x4a24ce7e8bc21bfa4ceebac947d2b179a3bfcf7c8e91f7fbd16cf968716cf924",
        blockNumber: 12339969,
        hash: "0x6809dc1b23dd55e51c45f9add0146fb6fb6a06656bf8325169769593432a081f",
        from: "0x3a55A1e7cf75dD8374de8463530dF721816F1411",
        to: "0x1eb7DBd296eB3FC08B2b6217d87E6Bf3CB6e42dF",
        logs: [
            {
                address: "0x1eb7DBd296eB3FC08B2b6217d87E6Bf3CB6e42dF",
                topics: [
                    "0x8f5866c09e99941481e2be79d3a7698371543fe3ad3387b903553fd6043e8550",
                ],
                data: "0x000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000003a55a1e7cf75dd8374de8463530df721816f14110000000000000000000000000000000000000000000000000000000000000001",
            },
        ],
        input: "0xefaa55a0000000000000000000000000000000000000000000000000000000000000000e",
        value: "0x0",
        nonce: "0x30a",
        gas: "0xbd19",
        gasUsed: "0xbd19",
        cumulativeGasUsed: "0xe75ec",
        gasPrice: "0x9502f907",
        gasTipCap: "0x9502f900",
        gasFeeCap: "0x9502f90e",
        alertId: null,
    },
    player2Joined: {
        network: "3",
        blockHash:
            "0xee8abb99f9f9d5977c58f88a7d7087ab4f2a7e71281cb94a47327b3712f25681",
        blockNumber: 12340010,
        hash: "0x2df7a3fe134192ba17ef26bcb0fd2c8b5cea4282bc6b7434bcf8be6d00106e1c",
        from: "0xf7ddedc66b1d482e5c38e4730b3357d32411e5dd",
        to: "0x1eb7dbd296eb3fc08b2b6217d87e6bf3cb6e42df",
        logs: [
            {
                address: "0x1eb7dbd296eb3fc08b2b6217d87e6bf3cb6e42df",
                topics: [
                    "0x8f5866c09e99941481e2be79d3a7698371543fe3ad3387b903553fd6043e8550",
                ],
                data: "0x000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000f7ddedc66b1d482e5c38e4730b3357d32411e5dd0000000000000000000000000000000000000000000000000000000000000002",
            },
        ],
        input: "0xefaa55a0000000000000000000000000000000000000000000000000000000000000000e",
        value: "0x",
        nonce: "0xd1",
        gas: "0x8376",
        gasUsed: "0x8376",
        cumulativeGasUsed: "0xe96b",
        gasPrice: "0x9502f908",
        gasTipCap: "0x9502f900",
        gasFeeCap: "0x9502f90e",
        alertId: null,
    },
    moves: [
        {
            network: "3",
            blockHash:
                "0xd2bdb9623b4a18c5165890882b175a54b73b11e2d6abf6b90e778fe1c83a9245",
            blockNumber: 12340129,
            hash: "0x03e871341fe7c177b65d8389a50916129ae3754353f66245720a4e116474f1da",
            from: "0x3a55a1e7cf75dd8374de8463530df721816f1411",
            to: "0x1eb7dbd296eb3fc08b2b6217d87e6bf3cb6e42df",
            logs: [
                {
                    address: "0x1eb7dbd296eb3fc08b2b6217d87e6bf3cb6e42df",
                    topics: [
                        "0xaa03b0eb53c70f6640eba4234ad2c58782c8927e7abf7d3a6e2c45d07ca9d583",
                    ],
                    data: "0x000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000003a55a1e7cf75dd8374de8463530df721816f141100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                },
            ],
            input: "0xcfc2f5ff000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            value: "0x",
            nonce: "0x30b",
            gas: "0x118fb",
            gasUsed: "0x118fb",
            cumulativeGasUsed: "0x9175ca",
            gasPrice: "0x9502f907",
            gasTipCap: "0x9502f900",
            gasFeeCap: "0x9502f90e",
            alertId: null,
        },
    ],
};
describe("TicTacToeActions", () => {
    it("new game", async () => {
        const testRuntime = new TestRuntime();
        await testRuntime.execute(
            newGameAction,
            testEvents.newGame as TransactionEvent
        );
        console.log(testRuntime.context.storage);
    });

    it("playerJoined", async () => {
        const testRuntime = new TestRuntime();
        testRuntime.context.storage.putJson("14", {
            players: {},
            board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
        });

        await testRuntime.execute(
            playerJoinedAction,
            testEvents.player1Joined as TransactionEvent
        );

        const p1JoinedState = Object.entries(
            (await testRuntime.context.storage.getJson("14")).players
        )[0];
        expect(p1JoinedState[0]).to.eq(
            "0x3a55a1e7cf75dd8374de8463530df721816f1411"
        );
        expect(p1JoinedState[1]).to.eq(1);

        await testRuntime.execute(
            playerJoinedAction,
            testEvents.player2Joined as TransactionEvent
        );

        const p2JoinedState = Object.entries(
            (await testRuntime.context.storage.getJson("14")).players
        )[1];
        expect(p2JoinedState[0]).to.eq(
            "0xf7ddedc66b1d482e5c38e4730b3357d32411e5dd"
        );
        expect(p2JoinedState[1]).to.eq(2);
        console.log(testRuntime.context.storage);
    });

    it("player makes move", async () => {
        const testRuntime = new TestRuntime();
        testRuntime.context.storage.putJson("14", {
            players: {
                "0x3a55a1e7cf75dd8374de8463530df721816f1411": 1,
                "0xf7ddedc66b1d482e5c38e4730b3357d32411e5dd": 2,
            },
            board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
        });
        await testRuntime.execute(playerMadeMoveAction, testEvents.moves[0]);
        expect((await testRuntime.context.storage.getJson("14")).board).deep.eq(
            [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ]
        );
    });
});
