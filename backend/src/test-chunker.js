
import { chunkText } from "./chunker.js";

const text = `
React is a JavaScript library for building user interfaces.
Components allow developers to create reusable UI elements.
The useState hook manages local component state.
The useEffect hook handles side effects such as API requests.
The useMemo hook caches calculated values.
The useCallback hook caches function references.
React.memo can reduce unnecessary component rerenders.
Context API shares values across component trees.
Redux is commonly used for centralized application state.
`;

const chunks = chunkText(text, 15, 5);

console.log("Total chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log(`\nChunk ${index + 1}:`);
  console.log(chunk);
  console.log("Words:", chunk.split(" ").length);
});
