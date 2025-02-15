import React from 'react';

// Define the TipTap node type
type Node = {
  type: string;
  text?: string;
  content?: Node[];
  marks?: { type: string }[];
};

type TipTapRendererProps = {
  content: any; // TipTap JSON content
};

// Function to render text with marks (bold, italic, etc.)
const renderText = (text: string, marks: { type: string }[] = []) => {
  let rendered = text;

  marks.forEach((mark) => {
    if (mark.type === 'bold') {
      rendered = <strong>{rendered}</strong>;
    } else if (mark.type === 'italic') {
      rendered = <em>{rendered}</em>;
    }
  });

  return rendered;
};

// Recursive function to render TipTap JSON
const TipTapRenderer: React.FC<TipTapRendererProps> = ({ content }) => {
  if (!content || !content.content) return null;

  return content.content.map((node: Node, index: number) => {
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index}>
            {node.content?.map((child) =>
              renderText(child.text ?? '', child.marks)
            )}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${
          node.attrs?.level || 1
        }` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index}>
            {node.content?.map((child) =>
              renderText(child.text ?? '', child.marks)
            )}
          </HeadingTag>
        );

      case 'bullet_list':
        return (
          <ul key={index}>
            {node.content?.map((item, idx) => (
              <li key={idx}>
                {item.content?.map((child) =>
                  renderText(child.text ?? '', child.marks)
                )}
              </li>
            ))}
          </ul>
        );

      case 'ordered_list':
        return (
          <ol key={index}>
            {node.content?.map((item, idx) => (
              <li key={idx}>
                {item.content?.map((child) =>
                  renderText(child.text ?? '', child.marks)
                )}
              </li>
            ))}
          </ol>
        );

      default:
        return null;
    }
  });
};

export default TipTapRenderer;
