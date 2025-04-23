import { expect, test, describe } from "vitest";
import {
    unflattenContributors,
    sortContributorsIntoRoleBuckets,
} from "./utils";
// import {sortContributorsIntoRoleBuckets} from "./utils";

describe("sortContributorsIntoRoleBuckets", () => {
    const contributors = [
        [
            {
                bio: "\u003Cb\u003ES. Craig Watkins\u003C/b\u003E is the Ernest S. Sharpe Centennial Professor and the founding director of the Institute for Media Innovation at the University of Texas at Austin. He is the author of five other books, \u003Ci\u003EDon't Knock the Hustle: Young Creatives, Tech Ingenuity, and the Making of a New Innovation Economy \u003C/i\u003E(2019), \u003Ci\u003EYoung People's Transition Into Creative Work: Navigating Challenges and Opportunities\u003C/i\u003E (2019), \u003Ci\u003EThe Young and the Digital: What the Migration to Social Network Sites, Games, and Anytime, Anywhere Media Means for Our Future\u003C/i\u003E (2009), \u003Ci\u003EHip Hop Matters: Politics, Pop Culture and the Struggle for the Soul of a Movement\u003C/i\u003E (2005), and \u003Ci\u003ERepresenting: Hip Hop Culture and the Production of Black Cinema\u003C/i\u003E (1998).",
                name: "S. Craig Watkins",
                nameSort: "Watkins, S. Craig",
                order: 1,
                role: "By (author)",
            },
            {
                bio: "\u003Cb\u003EAlexander Cho\u003C/b\u003E is a digital media anthropologist who studies how young people use social media. He is a Postdoctoral Scholar at the University of California Humanities Research Institute.",
                name: "Alexander Cho",
                nameSort: "Cho, Alexander",
                order: 2,
                role: "By (author)",
            },
            {
                bio: "\u003Cb\u003EAndres Lombana-Bermudez\u003C/b\u003E is a researcher, designer, and digital strategist working at the intersection of digital technology, youth, citizenship, and learning. He is a fellow at Harvard University’s Berkman Center for Internet and Society and a Research Associate with the Connected Learning Research Network.",
                name: "Andres Lombana-Bermudez",
                nameSort: "Lombana-Bermudez, Andres",
                order: 3,
                role: "With",
            },
            {
                bio: "\u003Cb\u003EVivian Shaw\u003C/b\u003E is a doctoral student in Sociology at the University of Texas at Austin.",
                name: "Vivian Shaw",
                nameSort: "Shaw, Vivian",
                order: 4,
                role: "With",
            },
            {
                bio: "\u003Cb\u003EJacqueline Vickery\u003C/b\u003E is Assistant Professor in the department of Media Arts at the University of North Texas. She is the author of Worried about the Wrong Things: Youth, Risk, and Opportunity in the Digital World (2017).",
                name: "Jacqueline Ryan Vickery",
                nameSort: "Vickery, Jacqueline Ryan",
                order: 5,
                role: "With",
            },
            {
                bio: "\u003Cb\u003ELauren Weinzimmer \u003C/b\u003Eis a PhD Candidate with a concentration in Critical Media Studies in the department of Communication at the University of Minnesota.",
                name: "Lauren Weinzimmer",
                nameSort: "Weinzimmer, Lauren",
                order: 6,
                role: "With",
            },
        ],
    ];
    const expected_result = [];
    test.todo("Returns an array of strings, sorted by priority", () => {
        expect
            .sortContributorsIntoRoleBuckets(contributors)
            .toBeEquals(expected_result);
    });
    test.todo("Replaces the wording of 'By (Author)' for 'By '"),
        () => {
            // checking first item since Authors are always the first item
            expect
                .sortContributorsIntoRoleBuckets(contributors)[0]
                .toMatch(/By /);
        };
});

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
