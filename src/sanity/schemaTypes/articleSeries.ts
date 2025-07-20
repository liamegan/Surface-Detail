import { defineField, defineType } from "sanity";

export const articleSeries = defineType({
  name: "articleSeries",
  title: "Article Series",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "list",
      title: "Articles",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
          options: {
            disableNew: true,
          },
        },
      ],
    }),
  ]});