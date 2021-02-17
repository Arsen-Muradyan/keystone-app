const { Text, Select } = require("@keystonejs/fields");
const postFields = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    body: {
      type: Text,
      isRequired: true,
      isMultiline: true,
    },
    status: {
      type: Select,
      options: [
        { value: "PUBLISHED", label: "Published" },
        { value: "UNPUBLISHED", label: "Unpublished" },
      ],
      defaultValue: "PUBLISHED",
    }
  },
};
module.exports = postFields;
