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
