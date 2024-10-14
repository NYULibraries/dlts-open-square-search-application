import { expect, test, describe } from "vitest";
import { unflattenContributors } from "./utils";

describe("unflattenContributors", () => {
    test("Checks for contributor order using same role", () => {
        let exampleResult = new Map();
        exampleResult.set(
            "author",
            "By Heike Raphael-Hernandez, Shannon Steen, Vijay Prashad, and Gary Okihiro"
        );
        let testContribs = JSON.stringify([
            {
                bio: "\u003Cb\u003EHeike Raphael-Hernandez\u003C/b\u003E is professor of English at the University of Maryland in Europe. She is editor of \u003Ci\u003EBlackening Europe: The African American Presence\u003C/i\u003E.",
                name: "Heike Raphael-Hernandez",
                nameSort: "Raphael-Hernandez, Heike",
                order: 1,
                role: "author",
            },
            {
                bio: "\u003Cb\u003EShannon Steen\u003C/b\u003E is assistant professor of theater, dance, and performance studies at the University of California at Berkeley.",
                name: "Shannon Steen",
                nameSort: "Steen, Shannon",
                order: 2,
                role: "author",
            },
            {
                bio: "\u003Cb\u003EVijay Prashad\u003C/b\u003E is author of \u003Ci\u003EEverybody was Kung Fu Fighting: Afro-Asian Connections and the Myth of Cultural Purity\u003C/i\u003E.",
                name: "Vijay Prashad",
                nameSort: "Prashad, Vijay",
                order: 3,
                role: "author",
            },
            {
                bio: "\u003Cb\u003EGary Okihiro\u003C/b\u003E is author of \u003Ci\u003ECommon Ground: Reimagining American History\u003C/i\u003E.",
                name: "Gary Okihiro",
                nameSort: "Okihiro, Gary",
                order: 4,
                role: "author",
            },
        ]);
        expect(unflattenContributors(testContribs)).toStrictEqual(
            exampleResult
        );
    });
    test("Checks for multiple contributor type handling", () => {
        let exampleResult = new Map();
        exampleResult.set(
            "Foreword by",
            "Foreword by Heike Raphael-Hernandez and Shannon Steen"
        );
        exampleResult.set("author", "By Vijay Prashad and Gary Okihiro");
        // use this data shape: https://sites.dlib.nyu.edu/viewer/api/v1/epubs/nyu-press/9780814769270/
        let testContribs = JSON.stringify([
            {
                bio: "\u003Cb\u003EHeike Raphael-Hernandez\u003C/b\u003E is professor of English at the University of Maryland in Europe. She is editor of \u003Ci\u003EBlackening Europe: The African American Presence\u003C/i\u003E.",
                name: "Heike Raphael-Hernandez",
                nameSort: "Raphael-Hernandez, Heike",
                order: 1,
                role: "Foreword by",
            },
            {
                bio: "\u003Cb\u003EShannon Steen\u003C/b\u003E is assistant professor of theater, dance, and performance studies at the University of California at Berkeley.",
                name: "Shannon Steen",
                nameSort: "Steen, Shannon",
                order: 2,
                role: "Foreword by",
            },
            {
                bio: "\u003Cb\u003EVijay Prashad\u003C/b\u003E is author of \u003Ci\u003EEverybody was Kung Fu Fighting: Afro-Asian Connections and the Myth of Cultural Purity\u003C/i\u003E.",
                name: "Vijay Prashad",
                nameSort: "Prashad, Vijay",
                order: 3,
                role: "author",
            },
            {
                bio: "\u003Cb\u003EGary Okihiro\u003C/b\u003E is author of \u003Ci\u003ECommon Ground: Reimagining American History\u003C/i\u003E.",
                name: "Gary Okihiro",
                nameSort: "Okihiro, Gary",
                order: 4,
                role: "author",
            },
        ]);
        expect(unflattenContributors(testContribs)).toStrictEqual(
            exampleResult
        );
    });
});
