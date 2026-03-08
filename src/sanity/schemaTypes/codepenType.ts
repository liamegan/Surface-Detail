import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const codepenType = defineType({
  name: "codepen",
  title: "CodePen",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "url",
      type: "url",
      title: "CodePen URL",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "scale",
      type: "number",
      title: "Scale",
      description: "Zoom level for the embed (e.g. 0.5 shows the pen at half size). Defaults to 1.",
      validation: (Rule) => Rule.min(0.1).max(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      url: "url",
    },
    prepare(selection) {
      const { title, url } = selection;
      return {
        title,
        subtitle: url,
      };
    },
  },
});
