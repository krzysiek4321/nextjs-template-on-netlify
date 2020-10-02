import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { DateTime } from 'schema-dts';

const indicatorsDirectory = path.join(process.cwd(), "src/pages/indicators");

export type FastFact = {
    readonly fact: string;
};

export type IndicatorContent = {
    readonly title: string;
    readonly category: string;
    readonly is_new: boolean;
    readonly creation_datetime: DateTime;
    readonly introduction: string;
    readonly fast_facts: FastFact[];
};
/*
* - {label: "Title", name: "title", widget: "string"}
      - {label: "Category", name: "category", widget: "select", options: ["transportation", "land and people",
                                                                          "economy", "environment", "equity"]}
      - {label: "Is New", name: "is-new", widget: "boolean", default: true}
      - {label: "Created at", name: "creation-datetime", widget: "datetime"}
      - {label: "Introduction", name: "intro", widget: "text"}
      - {label: "Fast facts", name: "fast-facts", widget: "list",
         field: {label: "Fact", name: "fact", widget: "markdown"}
      }
      - label: "Sections"
        name: "section-list"
        widget: "list"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "text"}
          - {label: "Content", name: "content", widget: "markdown"}
      - {label: "Ending notes", name: "end-notes", widget: "markdown"}
* */

let indicatorsCache: IndicatorContent[];

function fetchIndicatorContent(): IndicatorContent[] {
    if (indicatorsCache) {
        return indicatorsCache;
    }
    // Get file names under /posts
    const fileNames = fs.readdirSync(indicatorsDirectory);
    const allPostsData = fileNames
        .filter((it) => it.endsWith(".mdx"))
        .map((fileName) => {
            // Read markdown file as string
            const fullPath = path.join(indicatorsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents, {
                engines: {
                    yaml: (s) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }) as object,
                },
            });
            const matterData = matterResult.data as IndicatorContent;

            return matterData;
        });
    // Sort posts by date
    indicatorsCache = allPostsData.sort((a, b) => {
        if (a.creation_datetime < b.creation_datetime) {
            return 1;
        } else {
            return -1;
        }
    });
    return indicatorsCache;
}

export function listIndicatorContent(
    page: number,
    limit: number,
): IndicatorContent[] {
    return fetchIndicatorContent()
        .slice((page - 1) * limit, page * limit);
}
