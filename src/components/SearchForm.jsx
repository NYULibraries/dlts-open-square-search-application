import React from "react";
import { useState, useEffect } from "react";
import { Spinner } from "./Spinner";
import { ResultsPane } from "./ResultsPane";
import { Error } from "./Error";
import { solrQueryFactory } from "../utils/utils";
import "./SearchForm.css";

// TODO: delete this example object and test with local solr instance
const flatContributors = JSON.stringify([
    // TODO: check if this should be "bio":"something" instead of "contributors.bio":"something"
    {
        "contributors.bio":
            "Non usque tandem abutere Catilina Patiencia nostra",
        "contributors.name": "Richard Alba",
        "contributors.nameSort": "Alba, Richard",
        "contributors.order": 1,
        "contributors.role": "author",
    },
    {
        "contributors.bio":
            "Non usque tandem abutere Catilina Patiencia nostra",
        "contributors.name": "Mary C. Waters",
        "contributors.nameSort": "Waters, Mary C.",
        "contributors.order": 2,
        "contributors.role": "author",
    },
]);
const flatReviews = JSON.stringify([
    {
        "reviews.review": "",
        "reviews.reviewer": "",
    },
]);

const example = {
    // using flattened JSON objects as a way to secretly hold nested documents
    contributors: flatContributors,
    // "coverHref": "epub_content/9780814705384/ops/images/9780814705384.jpg",
    // "coverage": "New York",
    collection_code: "oa-books",
    publicationPlace: "New York",
    // "date": "2011",
    dateBook: "2011",
    dateOpenAccess: "2011",
    description:
        "One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.",
    // "description_html": "<p>One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.<br>While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.<br>Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.</p>",
    descriptionHtml:
        "<p>One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.<br>While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.<br>Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.</p>",
    // "format": "382 pages",
    pages: "382 pages",
    // "identifier": "9780814705384",
    openSquareId: "9780814705384",
    hasVideo: false,
    hasHiResImages: false,
    // missing required field: handle
    handle: "9780814705384",
    id: "9780814707432",
    isDownloadable: true,
    isbnHardcover: "9780814707432",
    isbnEbook: "9780814705384",
    isbnPaperback: "9780814707425",
    isbnLibrary: "9780814707432",
    language: "eng",
    license:
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
    // "license_abbreviation": "CC BY-NC-SA",
    licenseAbbreviation: "CC BY-NC-SA",
    // "license_icon": "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
    licenseIcon: "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
    // "license_link": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    // "nyu_press_website_buy_the_book_url": "https://nyupress.org/9780814707432",
    pressUrl: "https://nyupress.org/9780814707432",
    // "packageUrl": "epub_content/9780814705384",
    // "permanent_url": "https://doi.org/10.18574/nyu/9780814707425.001.0001",
    publisher: "NYU Press",
    // "rights": "All rights reserved",
    // "rootUrl": "epub_content/9780814705384",
    // does not correspond to the press' usual series field, more for internal use
    reivews: flatReviews,
    series: ["The Next Generation", "Next Gen"],
    seriesOpenAccess: [],
    // "subject": "Anthropology / History / Sociology",
    subjects: ["Anthropology", "History", "Sociology"],
    subtitle: "Immigrant Youth in a Comparative Perspective",
    // "thumbHref": "epub_content/9780814705384/ops/images/9780814705384-th.jpg",
    title: "The Next Generation",
    // "title_sort": "Next Generation",
    titleSort: "Next Generation",
    type: "Text",
    yearBook: "2011",
    yearOpenAccess: "2011",
};

const initialDataLoad = {
    numFound: 271,
    start: 0,
    docs: [
        {
            contributors: [
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
            ],
            dateBook: "2018-12-11",
            dateOpenAccess: "2018-12-11",
            description:
                "How black and Latino youth learn, create, and collaborate onlineThe Digital Edge examines how the digital and social-media lives of low-income youth, especially youth of color, have evolved amidst rapid social and technological change. While notions of the digital divide between the “technology rich” and the “technology poor” have largely focused on access to new media technologies, the contours of the digital divide have grown increasingly complex. Analyzing data from a year‐long ethnographic study at Freeway High School, the authors investigate how the digital media ecologies and practices of black and Latino youth have adapted as a result of the wider diffusion of the internet all around us--in homes, at school, and in the palm of our hands. Their eager adoption of different technologies forge new possibilities for learning and creating that recognize the collective power of youth: peer networks, inventive uses of technology, and impassioned interests that are remaking the digital world.Relying on nearly three hundred in-depth interviews with students, teachers, and parents, and hundreds of hours of observation in technology classes and after school programs, The Digital Edge carefully documents some of the emergent challenges for creating a more equitable digital and educational future. Focusing on the complex interactions between race, class, gender, geography and social inequality, the book explores the educational perils and possibilities of the expansion of digital media into the lives and learning environments of low-income youth. Ultimately, the book addresses how schools can support the ability of students to develop the social, technological, and educational skills required to navigate twenty-first century life.",
            descriptionHtml:
                "\u003Cp\u003EHow black and Latino youth learn, create, and collaborate online\u003Cbr\u003E\u003Cbr\u003EThe Digital Edge examines how the digital and social-media lives of low-income youth, especially youth of color, have evolved amidst rapid social and technological change. While notions of the digital divide between the “technology rich” and the “technology poor” have largely focused on access to new media technologies, the contours of the digital divide have grown increasingly complex. Analyzing data from a year‐long ethnographic study at Freeway High School, the authors investigate how the digital media ecologies and practices of black and Latino youth have adapted as a result of the wider diffusion of the internet all around us--in homes, at school, and in the palm of our hands. Their eager adoption of different technologies forge new possibilities for learning and creating that recognize the collective power of youth: peer networks, inventive uses of technology, and impassioned interests that are remaking the digital world.\u003Cbr\u003E\u003Cbr\u003ERelying on nearly three hundred in-depth interviews with students, teachers, and parents, and hundreds of hours of observation in technology classes and after school programs, The Digital Edge carefully documents some of the emergent challenges for creating a more equitable digital and educational future. Focusing on the complex interactions between race, class, gender, geography and social inequality, the book explores the educational perils and possibilities of the expansion of digital media into the lives and learning environments of low-income youth. Ultimately, the book addresses how schools can support the ability of students to develop the social, technological, and educational skills required to navigate twenty-first century life.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9781479888788.001.0001",
            handle: "https://doi.org/10.18574/nyu/9781479888788.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9781479847143",
            isbnHardcover: "9781479854110",
            isbnLibrary: "9781479888788",
            isbnPaperback: "9781479849857",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License",
            licenseAbbreviation: "CC BY-NC-ND",
            licenseAbbreviationFacet: "CC BY-NC-ND",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
            openSquareId: "9781479888788",
            pages: "304 pages",
            pressUrl: "https://nyupress.org/9781479849857",
            publisher: "NYU Press",
            reviews: [
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
            ],
            series: ["Connected Youth and Digital Futures"],
            seriesOpenAccess: ["Connected Youth and Digital Futures"],
            subjects: ["American Studies", "Media & Technology"],
            subjectsFacet: ["American Studies", "Media & Technology"],
            subtitle: "How Black and Latino Youth Navigate Digital Inequality",
            title: "The Digital Edge",
            titleSort: "Digital Edge",
            titleGroupId: "9781479854110",
            yearBook: "2018",
            yearOpenAccess: "2018",
            id: "9781479888788",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003ESamuel K. Byrd\u003C/b\u003E is Adjunct Assistant Professor at Hunter College (CUNY).",
                        name: "Samuel K. Byrd",
                        nameSort: "Byrd, Samuel K.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "2015-06-19",
            dateOpenAccess: "2022-04-15",
            description:
                "The Sounds of Latinidad explores the Latino music scene as a lens through which to understand changing ideas about latinidad in the New South. Focusing on Latino immigrant musicians and their fans in Charlotte, North Carolina, the volume shows how limited economic mobility, social marginalization, and restrictive immigration policies have stymied immigrants’ access to the American dream and musicians’ dreams of success. Instead, Latin music has become a way to form community, debate political questions, and claim cultural citizenship.  The volume illuminates the complexity of Latina/o musicians’ lives. They find themselves at the intersection of culture and politics, often pushed to define a vision of what it means to be Latino in a globalizing city in the Nuevo South. At the same time, they often avoid overt political statements and do not participate in immigrants’ rights struggles, instead holding a cautious view of political engagement. Yet despite this politics of ambivalence, Latina/o musicians do assert intellectual agency and engage in a politics that is embedded in their musical community, debating aesthetics, forging collective solidarity with their audiences, and protesting poor working conditions.  Challenging scholarship on popular music that focuses on famous artists or on one particular genre, this volume demonstrates how exploring the everyday lives of ordinary musicians can lead to a deeper understanding of musicians’ role in society. It argues that the often overlooked population of Latina/o musicians should be central to our understanding of what it means to live in a southern U.S. city today.",
            descriptionHtml:
                "\u003Cp\u003EThe Sounds of Latinidad explores the Latino music scene as a lens through which to understand changing ideas about latinidad in the New South. Focusing on Latino immigrant musicians and their fans in Charlotte, North Carolina, the volume shows how limited economic mobility, social marginalization, and restrictive immigration policies have stymied immigrants’ access to the American dream and musicians’ dreams of success. Instead, Latin music has become a way to form community, debate political questions, and claim cultural citizenship.  \u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003EThe volume illuminates the complexity of Latina/o musicians’ lives. They find themselves at the intersection of culture and politics, often pushed to define a vision of what it means to be Latino in a globalizing city in the Nuevo South. At the same time, they often avoid overt political statements and do not participate in immigrants’ rights struggles, instead holding a cautious view of political engagement. Yet despite this politics of ambivalence, Latina/o musicians do assert intellectual agency and engage in a politics that is embedded in their musical community, debating aesthetics, forging collective solidarity with their audiences, and protesting poor working conditions.  \u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003EChallenging scholarship on popular music that focuses on famous artists or on one particular genre, this volume demonstrates how exploring the everyday lives of ordinary musicians can lead to a deeper understanding of musicians’ role in society. It argues that the often overlooked population of Latina/o musicians should be central to our understanding of what it means to live in a southern U.S. city today.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9781479859405.001.0001",
            handle: "https://doi.org/10.18574/nyu/9781479859405.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9781479802012",
            isbnHardcover: "9781479859405",
            isbnLibrary: "9781479876426",
            isbnPaperback: "9781479860425",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9781479876426",
            pages: "304 pages",
            pressUrl: "https://nyupress.org/9781479860425",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003ESamuel K. Byrd\u003C/b\u003E is Adjunct Assistant Professor at Hunter College (CUNY).",
                        name: "Samuel K. Byrd",
                        nameSort: "Byrd, Samuel K.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["Social Transformations in American Anthropology"],
            subjects: ["Anthropology", "Latino\\a Studies", "Sociology"],
            subjectsFacet: ["Anthropology", "Latino\\a Studies", "Sociology"],
            subtitle:
                "Immigrants Making Music and Creating Culture in a Southern City",
            title: "The Sounds of Latinidad",
            titleSort: "Sounds of Latinidad",
            titleGroupId: "9781479859405",
            yearBook: "2015",
            yearOpenAccess: "2022",
            id: "9781479876426",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cp\u003E\u003Cb\u003ERobert L. Hayman, Jr.\u003C/b\u003E is Professor of Law at Widener University in Deleware and has taught at Georgetown University, Temple University, and the University of Missouri.\u003C/p\u003E",
                        name: "Robert L. Hayman, Jr.",
                        nameSort: "Hayman, Jr., Robert L.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "1997-11-01",
            dateOpenAccess: "2014-05-29",
            description:
                'What exactly is intelligence? Is it social achievement? Professional success? Is it common sense? Or the number on an IQ test? Interweaving engaging narratives with dramatic case studies, Robert L. Hayman, Jr., has written a history of intelligence that will forever change the way we think about who is smart and who is not. To give weight to his assertion that intelligence is not simply an inherent characteristic but rather one which reflects the interests and predispositions of those doing the measuring, Hayman traces numerous campaigns to classify human intelligence. His tour takes us through the early craniometric movement, eugenics, the development of the IQ, Spearman\'s "general" intelligence, and more recent works claiming a genetic basis for intelligence differences. What Hayman uncovers is the maddening irony of intelligence: that "scientific" efforts to reduce intelligence to a single, ordinal quantity have persisted--and at times captured our cultural imagination--not because of their scientific legitimacy, but because of their longstanding political appeal. The belief in a natural intellectual order was pervasive in "scientific" and "political" thought both at the founding of the Republic and throughout its nineteenth-century Reconstruction. And while we are today formally committed to the notion of equality under the law, our culture retains its central belief in the natural inequality of its members. Consequently, Hayman argues, the promise of a genuine equality can be realized only when the mythology of "intelligence" is debunked--only, that is, when we recognize the decisive role of culture in defining intelligence and creating intelligence differences. Only culture can give meaning to the statement that one person-- or one group--is smarter than another. And only culture can provide our motivation for saying it. With a keen wit and a sharp eye, Hayman highlights the inescapable contradictions that arise in a society committed both to liberty and to equality and traces how the resulting tensions manifest themselves in the ways we conceive of identity, community, and merit.',
            descriptionHtml:
                '\u003Cp\u003EWhat exactly is intelligence? Is it social achievement? Professional success? Is it common sense? Or the number on an IQ test?\u003Cbr\u003E Interweaving engaging narratives with dramatic case studies, Robert L. Hayman, Jr., has written a history of intelligence that will forever change the way we think about who is smart and who is not. To give weight to his assertion that intelligence is not simply an inherent characteristic but rather one which reflects the interests and predispositions of those doing the measuring, Hayman traces numerous campaigns to classify human intelligence. His tour takes us through the early craniometric movement, eugenics, the development of the IQ, Spearman\'s "general" intelligence, and more recent works claiming a genetic basis for intelligence differences.\u003Cbr\u003E What Hayman uncovers is the maddening irony of intelligence: that "scientific" efforts to reduce intelligence to a single, ordinal quantity have persisted--and at times captured our cultural imagination--not because of their scientific legitimacy, but because of their longstanding political appeal. The belief in a natural intellectual order was pervasive in "scientific" and "political" thought both at the founding of the Republic and throughout its nineteenth-century Reconstruction. And while we are today formally committed to the notion of equality under the law, our culture retains its central belief in the natural inequality of its members. Consequently, Hayman argues, the promise of a genuine equality can be realized only when the mythology of "intelligence" is debunked--only, that is, when we recognize the decisive role of culture in defining intelligence and creating intelligence differences. Only culture can give meaning to the statement that one person-- or one group--is smarter than another. And only culture can provide our motivation for saying it.\u003Cbr\u003E With a keen wit and a sharp eye, Hayman highlights the inescapable contradictions that arise in a society committed both to liberty and to equality and traces how the resulting tensions manifest themselves in the ways we conceive of identity, community, and merit.\u003C/p\u003E',
            doi: "https://doi.org/10.18574/nyu/9780814744789.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814744789.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814773178",
            isbnHardcover: "9780814735336",
            isbnLibrary: "9780814744789",
            isbnPaperback: "9780814735343",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814744789",
            pages: "414 pages",
            pressUrl: "https://nyupress.org/9780814735343",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cp\u003E\u003Cb\u003ERobert L. Hayman, Jr.\u003C/b\u003E is Professor of Law at Widener University in Deleware and has taught at Georgetown University, Temple University, and the University of Missouri.\u003C/p\u003E",
                        name: "Robert L. Hayman, Jr.",
                        nameSort: "Hayman, Jr., Robert L.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["Critical America"],
            subjects: ["Law", "Psychology", "Sociology"],
            subjectsFacet: ["Law", "Psychology", "Sociology"],
            subtitle: "Society, Intelligence, and Law",
            title: "The Smart Culture",
            titleSort: "Smart Culture",
            titleGroupId: "9780814735336",
            yearBook: "1997",
            yearOpenAccess: "2014",
            id: "9780814744789",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EThomas Cushman\u003C/b\u003E is Professor of Sociology at Wellesley College in Massachusetts and the founder and editor-at-large of the \u003Ci\u003EJournal of Human Rights\u003C/i\u003E. He has written or edited numerous books, including \u003Ci\u003EGeorge Orwell Into the 21st Century\u003C/i\u003E, \u003Ci\u003EA Matter of Principle: Humanitarian Arguments for War in Iraq\u003C/i\u003E, and \u003Ci\u003EThis Time We Knew: Western Responses to Genocide in Bosnia\u003C/i\u003E (NYU Press).",
                        name: "Thomas Cushman",
                        nameSort: "Cushman, Thomas",
                        order: 1,
                        role: "Edited by",
                    },
                    {
                        bio: "\u003Cb\u003EStjepan G. Mestrovic\u003C/b\u003E is Professor of Sociology at Texas A & M University and the author of numerous books including \u003Ci\u003EThe Balkanization of the West\u003C/i\u003E.",
                        name: "Stjepan Mestrovic",
                        nameSort: "Mestrovic, Stjepan",
                        order: 2,
                        role: "Edited by",
                    },
                ],
            ],
            dateBook: "1996-10-01",
            dateOpenAccess: "2014-05-29",
            description:
                "A crafted collection detailing western responses to the Balkan WarWe didn't know. For half a century, Western politicians and intellectuals have so explained away their inaction in the face of genocide in World War II. In stark contrast, Western observers today face a daily barrage of information and images, from CNN, the Internet, and newspapers about the parties and individuals responsible for the current Balkan War and crimes against humanity. The stories, often accompanied by video or pictures of rape, torture, mass graves, and ethnic cleansing, available almost instantaneously, do not allow even the most uninterested viewer to ignore the grim reality of genocide.And yet, while information abounds, so do rationalizations for non-intervention in Balkan affairs—the threshold of real genocide has yet to be reached in Bosnia; all sides are equally guilty; Islamic fundamentalism in Bosnia is a threat to the West; it will only end when they all tire of killing each other—to name but a few. In This Time We Knew, Thomas Cushman and Stjepan G. Mestrovic have put together a collection of critical, reflective, essays that offer detailed sociological, political, and historical analyses of western responses to the war. This volume punctures once and for all common excuses for Western inaction. This Time We Knew further reveals the reasons why these rationalizations have persisted and led to the West's failure to intercede, in the face of incontrovertible evidence, in the most egregious crimes against humanity to occur in Europe since World War II.Contributors to the volume include Kai Erickson, Jean Baudrillard, Mark Almond, David Riesman, Daniel Kofman, Brendan Simms, Daniele Conversi, Brad Kagan Blitz, James J. Sadkovich, and Sheri Fink.",
            descriptionHtml:
                "\u003Cp\u003E\u003Cb\u003EA crafted collection detailing western responses to the Balkan War\u003C/b\u003E\u003Cbr\u003E\u003Cbr\u003EWe didn't know. For half a century, Western politicians and intellectuals have so explained away their inaction in the face of genocide in World War II. In stark contrast, Western observers today face a daily barrage of information and images, from CNN, the Internet, and newspapers about the parties and individuals responsible for the current Balkan War and crimes against humanity. The stories, often accompanied by video or pictures of rape, torture, mass graves, and ethnic cleansing, available almost instantaneously, do not allow even the most uninterested viewer to ignore the grim reality of genocide.\u003Cbr\u003E\u003Cbr\u003EAnd yet, while information abounds, so do rationalizations for non-intervention in Balkan affairs—the threshold of real genocide has yet to be reached in Bosnia; all sides are equally guilty; Islamic fundamentalism in Bosnia is a threat to the West; it will only end when they all tire of killing each other—to name but a few.\u003Cbr\u003E\u003Cbr\u003E In \u003Cb\u003EThis Time We Knew\u003C/b\u003E, Thomas Cushman and Stjepan G. Mestrovic have put together a collection of critical, reflective, essays that offer detailed sociological, political, and historical analyses of western responses to the war. This volume punctures once and for all common excuses for Western inaction. \u003Cb\u003EThis Time We Knew\u003C/b\u003E further reveals the reasons why these rationalizations have persisted and led to the West's failure to intercede, in the face of incontrovertible evidence, in the most egregious crimes against humanity to occur in Europe since World War II.\u003Cbr\u003E\u003Cbr\u003EContributors to the volume include Kai Erickson, Jean Baudrillard, Mark Almond, David Riesman, Daniel Kofman, Brendan Simms, Daniele Conversi, Brad Kagan Blitz, James J. Sadkovich, and Sheri Fink.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814723708.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814723708.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814772249",
            isbnHardcover: "9780814715345",
            isbnLibrary: "9780814723708",
            isbnPaperback: "9780814715352",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814723708",
            pages: "422 pages",
            pressUrl: "https://nyupress.org/9780814715352",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EThomas Cushman\u003C/b\u003E is Professor of Sociology at Wellesley College in Massachusetts and the founder and editor-at-large of the \u003Ci\u003EJournal of Human Rights\u003C/i\u003E. He has written or edited numerous books, including \u003Ci\u003EGeorge Orwell Into the 21st Century\u003C/i\u003E, \u003Ci\u003EA Matter of Principle: Humanitarian Arguments for War in Iraq\u003C/i\u003E, and \u003Ci\u003EThis Time We Knew: Western Responses to Genocide in Bosnia\u003C/i\u003E (NYU Press).",
                        name: "Thomas Cushman",
                        nameSort: "Cushman, Thomas",
                        order: 1,
                        role: "Edited by",
                    },
                    {
                        bio: "\u003Cb\u003EStjepan G. Mestrovic\u003C/b\u003E is Professor of Sociology at Texas A & M University and the author of numerous books including \u003Ci\u003EThe Balkanization of the West\u003C/i\u003E.",
                        name: "Stjepan Mestrovic",
                        nameSort: "Mestrovic, Stjepan",
                        order: 2,
                        role: "Edited by",
                    },
                ],
            ],
            subjects: ["History", "Sociology"],
            subjectsFacet: ["History", "Sociology"],
            subtitle: "Western Responses to Genocide in Bosnia",
            title: "This Time We Knew",
            titleSort: "This Time We Knew",
            titleGroupId: "9780814715345",
            yearBook: "1996",
            yearOpenAccess: "2014",
            id: "9780814723708",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003ENihad M. Farooq\u003C/b\u003E is Associate Professor of American & Atlantic Studies and Director of Undergraduate Studies in the School of Literature, Media, and Communication at the Georgia Institute of Technology.",
                        name: "Nihad Farooq",
                        nameSort: "Farooq, Nihad",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "2016-07-19",
            dateOpenAccess: "2022-04-15",
            description:
                'In the 19th century, personhood was a term of regulation and discipline in which slaves, criminals, and others, could be “made and unmade." Yet it was precisely the fraught, uncontainable nature of personhood that necessitated its constant legislation, wherein its meaning could be both contested and controlled.Examining scientific and literary narratives, Nihad M. Farooq’s Undisciplined encourages an alternative consideration of personhood, one that emerges from evolutionary and ethnographic discourse. Moving chronologically from 1830 to 1940, Farooq explores the scientific and cultural entanglements of Atlantic travelers in and beyond the Darwin era, and invites us to attend more closely to the consequences of mobility and contact on disciplines and persons. Bringing together an innovative group of readings—from field journals, diaries, letters, and testimonies to novels, stage plays, and audio recordings—Farooq advocates for a reconsideration of science, personhood, and the priority of race for the field of American studies.  Whether expressed as narratives of acculturation, or as acts of resistance against the camera, the pen, or the shackle, these stories of the studied subjects of the Atlantic world add a new chapter to debates about personhood and disciplinarity in this era that actively challenged legal, social, and scientific categorizations.',
            descriptionHtml:
                '\u003Cp\u003EIn the 19th century, personhood was a term of regulation and discipline in which slaves, criminals, and others, could be “made and unmade." Yet it was precisely the fraught, uncontainable nature of personhood that necessitated its constant legislation, wherein its meaning could be both contested and controlled.\u003Cbr\u003E\u003Cbr\u003EExamining scientific and literary narratives, Nihad M. Farooq’s Undisciplined encourages an alternative consideration of personhood, one that emerges from evolutionary and ethnographic discourse. Moving chronologically from 1830 to 1940, Farooq explores the scientific and cultural entanglements of Atlantic travelers in and beyond the Darwin era, and invites us to attend more closely to the consequences of mobility and contact on disciplines and persons. Bringing together an innovative group of readings—from field journals, diaries, letters, and testimonies to novels, stage plays, and audio recordings—Farooq advocates for a reconsideration of science, personhood, and the priority of race for the field of American studies.  Whether expressed as narratives of acculturation, or as acts of resistance against the camera, the pen, or the shackle, these stories of the studied subjects of the Atlantic world add a new chapter to debates about personhood and disciplinarity in this era that actively challenged legal, social, and scientific categorizations.\u003C/p\u003E',
            doi: "https://doi.org/10.18574/nyu/9781479842865.001.0001",
            handle: "https://doi.org/10.18574/nyu/9781479842865.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9781479839896",
            isbnHardcover: "9781479812684",
            isbnLibrary: "9781479842865",
            isbnPaperback: "9781479806997",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9781479842865",
            pages: "280 pages",
            pressUrl: "https://nyupress.org/9781479806997",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003ENihad M. Farooq\u003C/b\u003E is Associate Professor of American & Atlantic Studies and Director of Undergraduate Studies in the School of Literature, Media, and Communication at the Georgia Institute of Technology.",
                        name: "Nihad Farooq",
                        nameSort: "Farooq, Nihad",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["America and the Long 19th Century"],
            subjects: ["American Studies", "History"],
            subjectsFacet: ["American Studies", "History"],
            subtitle:
                "Science, Ethnography, and Personhood in the Americas, 1830-1940",
            title: "Undisciplined",
            titleSort: "Undisciplined",
            titleGroupId: "9781479812684",
            yearBook: "2016",
            yearOpenAccess: "2022",
            id: "9781479842865",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EDaniel Rancour-Laferriere\u003C/b\u003E is Professor of Russian at the University of California, Davis. He is the author of many books, including The Slave Soul of Russia and Self-Analysis in Literary Study, both available from NYU Press.",
                        name: "Daniel Rancour-Laferriere",
                        nameSort: "Rancour-Laferriere, Daniel",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "1995-03-01",
            dateOpenAccess: "2014-05-29",
            description:
                "Why, asks Daniel Rancour-Laferriere in this controversial book, has Russia been a country of suffering?  Russian history, religion, folklore, and literature are rife with suffering. The plight of Anna Karenina, the submissiveness of serfs in the 16th and 17th centuries, ancient religious tracts emphasizing humility as the mother of virtues, the trauma of the Bolshevik revolution, the current economic upheavals wracking the country-- these are only a few of the symptoms of what The Slave Soul of Russia identifies as a veritable cult of suffering that has been centuries in the making. Bringing to light dozens of examples of self-defeating activities and behaviors that have become an integral component of the Russian psyche, Rancour-Laferriere convincingly illustrates how masochism has become a fact of everyday life in Russia.  Until now, much attention has been paid to the psychology of Russia's leaders and their impact on the country's condition.  Here, for the first time, is a compelling portrait of the Russian people's psychology.",
            descriptionHtml:
                "\u003Cp\u003EWhy, asks Daniel Rancour-Laferriere in this controversial book, has Russia been a country of suffering?  Russian history, religion, folklore, and literature are rife with suffering. The plight of Anna Karenina, the submissiveness of serfs in the 16th and 17th centuries, ancient religious tracts emphasizing humility as the mother of virtues, the trauma of the Bolshevik revolution, the current economic upheavals wracking the country-- these are only a few of the symptoms of what The Slave Soul of Russia identifies as a veritable cult of suffering that has been centuries in the making.\u003Cbr\u003E Bringing to light dozens of examples of self-defeating activities and behaviors that have become an integral component of the Russian psyche, Rancour-Laferriere convincingly illustrates how masochism has become a fact of everyday life in Russia.  Until now, much attention has been paid to the psychology of Russia's leaders and their impact on the country's condition.  Here, for the first time, is a compelling portrait of the Russian people's psychology.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814769409.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814769409.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814776605",
            isbnHardcover: "9780814774588",
            isbnLibrary: "9780814769409",
            isbnPaperback: "9780814774823",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814769409",
            pages: "344 pages",
            pressUrl: "https://nyupress.org/9780814774823",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EDaniel Rancour-Laferriere\u003C/b\u003E is Professor of Russian at the University of California, Davis. He is the author of many books, including The Slave Soul of Russia and Self-Analysis in Literary Study, both available from NYU Press.",
                        name: "Daniel Rancour-Laferriere",
                        nameSort: "Rancour-Laferriere, Daniel",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            subjects: ["Psychology", "Sociology"],
            subjectsFacet: ["Psychology", "Sociology"],
            subtitle: "Moral Masochism and the Cult of Suffering",
            title: "The Slave Soul of Russia",
            titleSort: "Slave Soul of Russia",
            titleGroupId: "9780814774588",
            yearBook: "1995",
            yearOpenAccess: "2014",
            id: "9780814769409",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EM. Guy Thompson\u003C/b\u003E, Ph.D founded the Free Association in San Francisco, an analytic training scheme devoted to integrating phenomenology and psychoanalysis. He is the author of \u003Ci\u003EThe Death of Desire: A Study in Psychopathology\u003C/i\u003E, also published by New York University Press. He currently practices psychoanalysis in San Francisco.",
                        name: "Michael Guy Thompson",
                        nameSort: "Thompson, Michael Guy",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "1994-06-01",
            dateOpenAccess: "2014-05-29",
            description:
                "In this unusual and much-needed reappraisal of Freud's clinical technique, M. Guy Thompson challenges the conventional notion that psychoanalysis promotes relief from suffering and replaces it with a more radical assertion, that psychoanalysis seeks to mend our relationship with the real that has been fractured by our avoidance of the same.  Thompson suggests that, while avoiding reality may help to relieve our experience of suffering, this short-term solution inevitably leads to a split in our existence. M. Guy Thompson forcefully disagrees with the recent trend that dismisses Freud as an historical figure who is out of step with the times.  He argues, instead, for a return to the forgotten Freud, a man inherently philosophical and rooted in a Greek preoccupation with the nature of truth, ethics, the purpose of life and our relationship with reality.  Thompson's argument is situated in a stunning re-reading of Freud's technical papers, including a new evaluation of his analyses of Dora and the Rat Man in the context of Heidegger's understanding of truth. In this remarkable examination of Freud's technical recommendations, M. Guy Thompson explains how psychoanalysis was originally designed to re-acquaint us with realities we had  abandoned by encountering them in the contest of the analytic experience.  This provocative examination of Freud's conception of psychoanalysis reveals a more personal Freud than we had previously supposed, one that is more humanistic and real.",
            descriptionHtml:
                "\u003Cp\u003EIn this unusual and much-needed reappraisal of Freud's clinical technique, M. Guy Thompson challenges the conventional notion that psychoanalysis promotes relief from suffering and replaces it with a more radical assertion, that psychoanalysis seeks to mend our relationship with the real that has been fractured by our avoidance of the same.  Thompson suggests that, while avoiding reality may help to relieve our experience of suffering, this short-term solution inevitably leads to a split in our existence.\u003Cbr\u003E M. Guy Thompson forcefully disagrees with the recent trend that dismisses Freud as an historical figure who is out of step with the times.  He argues, instead, for a return to the forgotten Freud, a man inherently philosophical and rooted in a Greek preoccupation with the nature of truth, ethics, the purpose of life and our relationship with reality.  Thompson's argument is situated in a stunning re-reading of Freud's technical papers, including a new evaluation of his analyses of Dora and the Rat Man in the context of Heidegger's understanding of truth.\u003Cbr\u003E In this remarkable examination of Freud's technical recommendations, M. Guy Thompson explains how psychoanalysis was originally designed to re-acquaint us with realities we had  abandoned by encountering them in the contest of the analytic experience.  This provocative examination of Freud's conception of psychoanalysis reveals a more personal Freud than we had previously supposed, one that is more humanistic and real.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814784488.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814784488.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814783337",
            isbnHardcover: "9780814782064",
            isbnLibrary: "9780814784488",
            isbnPaperback: "9780814782194",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814784488",
            pages: "318 pages",
            pressUrl: "https://nyupress.org/9780814782194",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EM. Guy Thompson\u003C/b\u003E, Ph.D founded the Free Association in San Francisco, an analytic training scheme devoted to integrating phenomenology and psychoanalysis. He is the author of \u003Ci\u003EThe Death of Desire: A Study in Psychopathology\u003C/i\u003E, also published by New York University Press. He currently practices psychoanalysis in San Francisco.",
                        name: "Michael Guy Thompson",
                        nameSort: "Thompson, Michael Guy",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            subjects: ["History", "Psychology"],
            subjectsFacet: ["History", "Psychology"],
            subtitle: "The Encounter With the Real",
            title: "The Truth About Freud's Technique",
            titleSort: "Truth About Freud's Technique",
            titleGroupId: "9780814782064",
            yearBook: "1994",
            yearOpenAccess: "2014",
            id: "9780814784488",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EBill Ong Hing\u003C/b\u003E is Associate Professor of Law at Stanford Law School.",
                        name: "Bill Ong Hing",
                        nameSort: "Hing, Bill Ong",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "1997-03-01",
            dateOpenAccess: "2014-05-29",
            description:
                "The impetus behind California's Proposition 187 clearly reflects the growing anti-immigrant sentiment in this country. Many Americans regard today's new immigrants as not truly American, as somehow less committed to the ideals on which the country was founded. In clear, precise terms, Bill Ong Hing considers immigration in the context of the global economy, a sluggish national economy, and the hard facts about downsizing. Importantly, he also confronts the emphatic claims of immigrant supporters that immigrants do assimilate, take jobs that native workers don't want, and contribute more to the tax coffers than they take out of the system. A major contribution of Hing's book is its emphasis on such often-overlooked issues as the competition between immigrants and African Americans, inter-group tension, and ethnic separatism, issues constantly brushed aside both by immigrant rights groups and the anti-immigrant right. Drawing on Hing's work as a lawyer deeply involved in the day-to-day life of his immigrant clients, To Be An American is a unique blend of substantive analysis, policy, and personal experience.",
            descriptionHtml:
                "\u003Cp\u003EThe impetus behind California's Proposition 187 clearly reflects the growing anti-immigrant sentiment in this country. Many Americans regard today's new immigrants as not truly American, as somehow less committed to the ideals on which the country was founded. In clear, precise terms, Bill Ong Hing considers immigration in the context of the global economy, a sluggish national economy, and the hard facts about downsizing. Importantly, he also confronts the emphatic claims of immigrant supporters that immigrants do assimilate, take jobs that native workers don't want, and contribute more to the tax coffers than they take out of the system.\u003Cbr\u003E A major contribution of Hing's book is its emphasis on such often-overlooked issues as the competition between immigrants and African Americans, inter-group tension, and ethnic separatism, issues constantly brushed aside both by immigrant rights groups and the anti-immigrant right. Drawing on Hing's work as a lawyer deeply involved in the day-to-day life of his immigrant clients, \u003Cb\u003ETo Be An American\u003C/b\u003E is a unique blend of substantive analysis, policy, and personal experience.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814744840.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814744840.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814773246",
            isbnHardcover: "9780814735237",
            isbnLibrary: "9780814744840",
            isbnPaperback: "9780814736098",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814744840",
            pages: "256 pages",
            pressUrl: "https://nyupress.org/9780814736098",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EBill Ong Hing\u003C/b\u003E is Associate Professor of Law at Stanford Law School.",
                        name: "Bill Ong Hing",
                        nameSort: "Hing, Bill Ong",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["Critical America"],
            subjects: [
                "African American Studies",
                "Law",
                "Politics",
                "Sociology",
            ],
            subjectsFacet: [
                "African American Studies",
                "Law",
                "Politics",
                "Sociology",
            ],
            subtitle: "Cultural Pluralism and the Rhetoric of Assimilation",
            title: "To Be An American",
            titleSort: "To Be An American",
            titleGroupId: "9780814735237",
            yearBook: "1997",
            yearOpenAccess: "2014",
            id: "9780814744840",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EFrederick C. Knight\u003C/b\u003E is Chair of the Department of History at Morehouse College.",
                        name: "Frederick C. Knight",
                        nameSort: "Knight, Frederick C.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "2010-01-01",
            dateOpenAccess: "2022-04-15",
            description:
                "From the sixteenth to early-nineteenth century, four times more Africans than Europeans crossed the Atlantic Ocean to the Americas. While this forced migration stripped slaves of their liberty, it failed to destroy many of their cultural practices, which came with Africans to the New World. In Working the Diaspora, Frederick Knight examines work cultures on both sides of the Atlantic, from West and West Central Africa to British North America and the Caribbean.Knight demonstrates that the knowledge that Africans carried across the Atlantic shaped Anglo-American agricultural development and made particularly important contributions to cotton, indigo, tobacco, and staple food cultivation. The book also compellingly argues that the work experience of slaves shaped their views of the natural world. Broad in scope, clearly written, and at the center of current scholarly debates, Working the Diaspora challenges readers to alter their conceptual frameworks about Africans by looking at them as workers who, through the course of the Atlantic slave trade and plantation labor, shaped the development of the Americas in significant ways.",
            descriptionHtml:
                "\u003Cp\u003EFrom the sixteenth to early-nineteenth century, four times more Africans than Europeans crossed the Atlantic Ocean to the Americas. While this forced migration stripped slaves of their liberty, it failed to destroy many of their cultural practices, which came with Africans to the New World. In Working the Diaspora, Frederick Knight examines work cultures on both sides of the Atlantic, from West and West Central Africa to British North America and the Caribbean.\u003Cbr\u003EKnight demonstrates that the knowledge that Africans carried across the Atlantic shaped Anglo-American agricultural development and made particularly important contributions to cotton, indigo, tobacco, and staple food cultivation. The book also compellingly argues that the work experience of slaves shaped their views of the natural world. Broad in scope, clearly written, and at the center of current scholarly debates, Working the Diaspora challenges readers to alter their conceptual frameworks about Africans by looking at them as workers who, through the course of the Atlantic slave trade and plantation labor, shaped the development of the Americas in significant ways.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814748183.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814748183.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814748343",
            isbnHardcover: "9780814748183",
            isbnLibrary: "9780814749128",
            isbnPaperback: "9780814763698",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814749128",
            pages: "252 pages",
            pressUrl: "https://nyupress.org/9780814763698",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EFrederick C. Knight\u003C/b\u003E is Chair of the Department of History at Morehouse College.",
                        name: "Frederick C. Knight",
                        nameSort: "Knight, Frederick C.",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["Culture, Labor, History"],
            subjects: ["History"],
            subjectsFacet: ["History"],
            subtitle:
                "The Impact of African Labor on the Anglo-American World, 1650-1850",
            title: "Working the Diaspora",
            titleSort: "Working the Diaspora",
            titleGroupId: "9780814748183",
            yearBook: "2010",
            yearOpenAccess: "2022",
            id: "9780814749128",
        },
        {
            contributors: [
                [
                    {
                        bio: "\u003Cb\u003EJohn Tehranian\u003C/b\u003E is currently Professor at Chapman University School of Law in Orange County, California.",
                        name: "John Tehranian",
                        nameSort: "Tehranian, John",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            dateBook: "2008-12-01",
            dateOpenAccess: "2021-06-08",
            description:
                "Middle Easterners: Sometimes White, Sometimes Not - an article by John TehranianThe Middle Eastern question lies at the heart of the most pressing issues of our time: the war in Iraq and on terrorism, the growing tension between preservation of our national security and protection of our civil rights, and the debate over immigration, assimilation, and our national identity. Yet paradoxically, little attention is focused on our domestic Middle Eastern population and its place in American society. Unlike many other racial minorities in our country, Middle Eastern Americans have faced rising, rather than diminishing, degrees of discrimination over time; a fact highlighted by recent targeted immigration policies, racial profiling, a war on terrorism with a decided racialist bent, and growing rates of job discrimination and hate crime. Oddly enough, however, Middle Eastern Americans are not even considered a minority in official government data. Instead, they are deemed white by law. In Whitewashed, John Tehranian combines his own personal experiences as an Iranian American with an expert&#8217;s analysis of current events, legal trends, and critical theory to analyze this bizarre Catch-22 of Middle Eastern racial classification. He explains how American constructions of Middle Eastern racial identity have changed over the last two centuries, paying particular attention to the shift in perceptions of the Middle Easterner from friendly foreigner to enemy alien, a trend accelerated by the tragic events of 9/11. Focusing on the contemporary immigration debate, the war on terrorism, media portrayals of Middle Easterners, and the processes of creating racial stereotypes, Tehranian argues that, despite its many successes, the modern civil rights movement has not done enough to protect the liberties of Middle Eastern Americans.By following how concepts of whiteness have transformed over time, Whitewashed forces readers to rethink and question some of their most deeply held assumptions about race in American society.",
            descriptionHtml:
                "\u003Cp\u003EMiddle Easterners: Sometimes White, Sometimes Not - an article by John Tehranian\u003Cbr\u003EThe Middle Eastern question lies at the heart of the most pressing issues of our time: the war in Iraq and on terrorism, the growing tension between preservation of our national security and protection of our civil rights, and the debate over immigration, assimilation, and our national identity. Yet paradoxically, little attention is focused on our domestic Middle Eastern population and its place in American society. Unlike many other racial minorities in our country, Middle Eastern Americans have faced rising, rather than diminishing, degrees of discrimination over time; a fact highlighted by recent targeted immigration policies, racial profiling, a war on terrorism with a decided racialist bent, and growing rates of job discrimination and hate crime. Oddly enough, however, Middle Eastern Americans are not even considered a minority in official government data. Instead, they are deemed white by law. \u003Cbr\u003EIn Whitewashed, John Tehranian combines his own personal experiences as an Iranian American with an expert&#8217;s analysis of current events, legal trends, and critical theory to analyze this bizarre Catch-22 of Middle Eastern racial classification. He explains how American constructions of Middle Eastern racial identity have changed over the last two centuries, paying particular attention to the shift in perceptions of the Middle Easterner from friendly foreigner to enemy alien, a trend accelerated by the tragic events of 9/11. Focusing on the contemporary immigration debate, the war on terrorism, media portrayals of Middle Easterners, and the processes of creating racial stereotypes, Tehranian argues that, despite its many successes, the modern civil rights movement has not done enough to protect the liberties of Middle Eastern Americans.\u003Cbr\u003EBy following how concepts of whiteness have transformed over time, Whitewashed forces readers to rethink and question some of their most deeply held assumptions about race in American society.\u003C/p\u003E",
            doi: "https://doi.org/10.18574/nyu/9780814784235.001.0001",
            handle: "https://doi.org/10.18574/nyu/9780814784235.001.0001",
            hasHiResImages: false,
            hasVideo: false,
            isbnEbook: "9780814783276",
            isbnHardcover: "9780814783061",
            isbnLibrary: "9780814784235",
            isbnPaperback: "9780814782736",
            isDownloadable: true,
            language: "eng",
            license:
                "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
            licenseAbbreviation: "CC BY-NC-SA",
            licenseAbbreviationFacet: "CC BY-NC-SA",
            licenseIcon:
                "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
            licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            openSquareId: "9780814784235",
            pages: "256 pages",
            pressUrl: "https://nyupress.org/9780814782736",
            publisher: "NYU Press",
            reviews: [
                [
                    {
                        bio: "\u003Cb\u003EJohn Tehranian\u003C/b\u003E is currently Professor at Chapman University School of Law in Orange County, California.",
                        name: "John Tehranian",
                        nameSort: "Tehranian, John",
                        order: 1,
                        role: "By (author)",
                    },
                ],
            ],
            series: ["Critical America"],
            subjects: ["American Studies"],
            subjectsFacet: ["American Studies"],
            subtitle: "America’s Invisible Middle Eastern Minority",
            title: "Whitewashed",
            titleSort: "Whitewashed",
            titleGroupId: "9780814783061",
            yearBook: "2008",
            yearOpenAccess: "2021",
            id: "9780814784235",
        },
    ],
};

export function SearchForm() {
    const [error, setError] = useState(false);
    // TODO: refine error message handling
    const [errorMessage, setErrorMessage] = useState("CORS");
    const [searching, setSearching] = useState(false);
    const [publications, setPublications] = useState([]);
    const [pristine, setPristine] = useState(true);
    // note: there is no initial load of data, search bar shown empty
    // const [publications, setPublications] = useState(initialDataLoad.docs);

    // yes partial matching with highlighting

    // TODO: handle query params with useSearchParams from react router
    // const handleSearchParams = () => {
    //     pass the search parameters to the url
    // };

    /**
     * method that makes the fetch call to Alberto's API and sets the state
     * @param {event} event - browser event
     */
    const handleSubmit = (event) => {
        // TODO: how do you handle multiple searches one after another?
        // TODO: do you remove the previous state of the search and then populate with data from fetch call?
        event.preventDefault();
        setPristine(false);
        setSearching(true);
        // handleSearchParams();
        const queryURL = solrQueryFactory(event.target.search.value);

        fetch(queryURL)
            .then((res) => res.json())
            .then((data) => {
                if (data.numFound > 0) {
                    console.log(data.docs);
                    setPublications(data.docs);
                }
            })
            .catch((e) => {
                setError(true);
                setErrorMessage(e.message);
            })
            .finally(setSearching(false));
    };

    return (
        <section>
            {/*
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>import.meta.env.MODE: {import.meta.env.MODE}</p>
            <p>import.meta.env.PROD: {import.meta.env.PROD}</p>
            <p>import.meta.env.DEV: {import.meta.env.DEV}</p>
            <p>import.meta.env.SSR: {import.meta.env.SSR}</p>
            <p>import.meta.env.VITE_TITLE: {import.meta.env.VITE_TITLE}</p>
            */}
            <form id="osq-search" onSubmit={handleSubmit}>
                <div display="flex" className="container">
                    <input
                        aria-label="Search for books"
                        placeholder="Search for books"
                        type="text"
                        id="search-input"
                        name="search"
                    />
                    <button type="submit" aria-label="submit" value="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        </svg>
                    </button>
                </div>
            </form>
            {searching && <Spinner />}
            {error && <Error message={errorMessage} />}
            {!error && !searching && publications && (
                <ResultsPane
                    publications={publications}
                    error={error}
                    // highlights={}
                    // maxDescriptionLength={publications.maxDescriptionLength}
                    numBooks={publications.length}
                    // numBooks={}
                    pristine
                />
            )}
        </section>
    );
}
