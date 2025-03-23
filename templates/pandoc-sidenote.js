/*
MIT License

Copyright(c) 2023 Shigeru Kobayashi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files(the "Software"), to deal
    in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

process.stdin.setEncoding("utf8");

let inputData = "";

process.stdin.on("data", (chunk) => {
    inputData += chunk;
});

process.stdin.on("end", () => {
    let dataObj = JSON.parse(inputData);
    let filteredDataObj = convertFootnotesToSideNotes(dataObj);
    process.stdout.write(JSON.stringify(filteredDataObj));
});

process.stdin.resume();

function convertFootnotesToSideNotes(dataObj) {
    let noteCounter = 1;

    const processElement = (element) => {
        if (element.t === "Space") {
            return " ";
        } else if (element.t === "SoftBreak") {
            return "<br />";
        } else if (element.t === "Str") {
            const content = element.c;
            const urlPattern = /(https?:\/\/[^\s$.?#].[^\s]*)/gi;
            return content.replace(urlPattern, (match) => {
                const trimmedMatch = match.replace(/[\s.;、。]+$/, "");
                const trailingChars = match.slice(trimmedMatch.length);
                return `<a href="${trimmedMatch}" target="_blank" rel="noopener noreferrer">${trimmedMatch}</a>${trailingChars}`;
            });
        } else if (element.t === "Emph") {
            return `<em>${element.c.map(processElement).join("")}</em>`;
        } else if (element.t === "Quoted") {
            let quoteStart = "";
            let quoteEnd = "";

            if (element.c[0].t === "SingleQuote") {
                quoteStart = "‘";
                quoteEnd = "’";
            } else if (element.c[0].t === "DoubleQuote") {
                quoteStart = "“";
                quoteEnd = "”";
            }

            const quotedText = `${element.c[1].map(processElement).join("")}`;
            return `${quoteStart}${quotedText}${quoteEnd}`;
        } else if (element.t === "Strong") {
            return `<strong>${element.c.map(processElement).join("")}</strong>`;
        } else if (element.t === "Link") {
            return `<a href="${element.c[2][0]}" target="_blank" rel="noopener noreferrer">${element.c[1][0].c}</a>`;
        } else if (element.t === "Subscript") {
            return `<sub>${element.c.map(processElement).join("")}</sub>`;
        } else if (element.t === "Superscript") {
            return `<sup>${element.c.map(processElement).join("")}</sup>`;
        } else if (element.t === "Underline") {
            return `<u>${element.c.map(processElement).join("")}</u>`;
        } else if (element.t === "Strikeout") {
            return `<s>${element.c.map(processElement).join("")}</s>`;
        } else {
            return element.c;
        }
    };

    const visitBlocks = (blocks) => {
        return blocks.map((block) => {
            if (block.t === "Note") {
                const noteId = "sn-" + noteCounter;
                noteCounter++;

                const noteContent = block.c[0].c.map(processElement).join("");

                // Check if noteContent starts with "{-}"
                const marginNotePattern = /^{-}\s*/;
                const isMarginNote = marginNotePattern.test(noteContent);
                const labelClass = isMarginNote
                    ? "margin-toggle"
                    : "margin-toggle sidenote-number";
                const labelSymbol = isMarginNote ? "&#8853;" : "";
                const noteTypeClass = isMarginNote ? "marginnote" : "sidenote";

                // Remove "{-}" and any following spaces from noteContent
                const cleanedNoteContent = noteContent.replace(marginNotePattern, "");

                return {
                    t: "RawInline",
                    c: [
                        "html",
                        `<span class="sidenote-wrapper"><label for="${noteId}" class="${labelClass}">${labelSymbol}</label><input type="checkbox" id="${noteId}" class="margin-toggle"/><span class="${noteTypeClass}">${cleanedNoteContent}<br /><br /></span></span>`,
                    ],
                };
            } else if (block.t === "Para" || block.t === "Header") {
                block.c = visitBlocks(block.c);
                return block;
            } else {
                return block;
            }
        });
    };

    dataObj.blocks = visitBlocks(dataObj.blocks);
    return dataObj;
}