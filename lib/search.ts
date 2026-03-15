import LabDocument from "@/models/Document";

export async function searchDocuments(
  query: string,
  type: "all" | "title" | "content"
) {
  const limit = 20;

  let searchQuery: any = {};
  let projection: any = {};
  let sort: any = { createdAt: -1 };

  if (type === "all") {
    searchQuery = {
      $text: { $search: query },
    };

    projection = {
      score: { $meta: "textScore" },
    };

    sort = {
      score: { $meta: "textScore" },
    };
  }

  if (type === "title") {
    searchQuery = {
      title: { $regex: query, $options: "i" },
    };
  }

  if (type === "content") {
    searchQuery = {
      extractedText: { $regex: query, $options: "i" },
    };
  }

  const documents = await LabDocument.find(searchQuery, projection)
    .sort(sort)
    .limit(limit)
    .lean();

  return { documents };
}

export function extractSnippet(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());

  if (index === -1) {
    return text.slice(0, 200);
  }

  const start = Math.max(0, index - 80);
  const end = Math.min(text.length, index + 120);

  return text.slice(start, end);
}

export function highlightText(text: string, query: string) {
  const regex = new RegExp(`(${query})`, "gi");

  return text.replace(regex, `<mark>$1</mark>`);
}