import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import React, { ReactElement } from 'react';

// Define styles for both PDF and HTML rendering
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  h1: {
    fontSize: 32,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  p: {
    fontSize: 16,
    marginBottom: 0,
    lineHeight: 1.5,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 16,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 4,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#d1d5db',
    paddingLeft: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: 16,
  },
  orderedListItem: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: 16,
  },
  url: {
    color: '#2563eb',
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
});

interface MarkdownPDFProps {
  markdown: string;
  asHtml?: boolean;
}

/**
 * Maps Markdown element types to their corresponding HTML classes
 */
const getHtmlClass = (elementType: string): string => {
  const classMap: Record<string, string> = {
    h1: 'text-4xl font-bold my-4',
    h2: 'text-2xl font-bold my-3',
    h3: 'text-xl font-bold my-2',
    p: 'text-base whitespace-pre-wrap',
    strong: 'font-bold',
    em: 'italic',
    code: 'font-mono bg-gray-100 p-1 rounded',
    blockquote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
    hr: 'my-4 border-t border-gray-300',
    li: 'list-disc ml-5 whitespace-pre-wrap',
    ol: 'list-decimal ml-5 whitespace-pre-wrap',
    a: 'text-blue-600 underline',
    url: 'text-blue-600 underline break-all',
  };
  return classMap[elementType] || '';
};

/**
 * Component that renders Markdown content either as HTML or PDF
 */
export const MarkdownRenderer = ({
  markdown,
  asHtml = false,
}: MarkdownPDFProps) => {
  /**
   * Renders text with Markdown formatting (bold, italic, links, etc.)
   */
  const renderTextWithFormatting = (text: string): ReactElement => {
    const elements: ReactElement[] = [];
    let remainingText = text;

    // Define all supported markdown patterns and their renderers
    const regexes: Array<{
      regex: RegExp;
      render: (
        content: string,
        key: string,
        match: RegExpExecArray
      ) => ReactElement;
    }> = [
      {
        regex: /\*\*\*(.+?)\*\*\*/, // ***bold italic***
        render: (content, key) =>
          asHtml ? (
            <span key={key} className="font-bold italic">
              {content}
            </span>
          ) : (
            <Text key={key} style={[styles.strong, styles.em]}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*\*_(.+?)_\*\*/, // **_bold italic_**
        render: (content, key) =>
          asHtml ? (
            <span key={key} className="font-bold italic">
              {content}
            </span>
          ) : (
            <Text key={key} style={[styles.strong, styles.em]}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*\*(.+?)\*\*/, // **bold**
        render: (content, key) =>
          asHtml ? (
            <span key={key} className="font-bold">
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.strong}>
              {content}
            </Text>
          ),
      },
      {
        regex: /_(.+?)_/, // _italic_
        render: (content, key) =>
          asHtml ? (
            <span key={key} className="italic">
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.em}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*(.+?)\*/, // *italic*
        render: (content, key) =>
          asHtml ? (
            <span key={key} className="italic">
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.em}>
              {content}
            </Text>
          ),
      },
      {
        regex: /`(.+?)`/, // `code`
        render: (content, key) =>
          asHtml ? (
            <code key={key} className="bg-gray-100 p-1 rounded font-mono">
              {content}
            </code>
          ) : (
            <Text key={key} style={styles.code}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\[(.+?)\]\((.+?)\)/, // [link](url)
        render: (content, key, match) =>
          asHtml ? (
            <a
              key={key}
              href={match[2]}
              className={getHtmlClass('a')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {match[1]}
            </a>
          ) : (
            <Link key={key} src={match[2]} style={styles.link}>
              {match[1]}
            </Link>
          ),
      },
    ];

    // Process the text to find and replace all markdown patterns
    while (remainingText.length > 0) {
      let matched = false;

      // Try each regex pattern in order
      for (const { regex, render } of regexes) {
        const match = regex.exec(remainingText);
        if (match) {
          // Add text before the match
          if (match.index > 0) {
            const before = remainingText.substring(0, match.index);
            elements.push(
              asHtml ? (
                <span key={`text-${elements.length}`}>{before}</span>
              ) : (
                <Text key={`text-${elements.length}`}>{before}</Text>
              )
            );
          }

          // Add the formatted content
          elements.push(render(match[1], `match-${elements.length}`, match));

          // Remove processed text
          remainingText = remainingText.substring(
            match.index + match[0].length
          );
          matched = true;
          break;
        }
      }

      // If no patterns matched, add remaining text as plain text
      if (!matched) {
        elements.push(
          asHtml ? (
            <span key={`text-${elements.length}`}>{remainingText}</span>
          ) : (
            <Text key={`text-${elements.length}`}>{remainingText}</Text>
          )
        );
        break;
      }
    }

    return asHtml ? <>{elements}</> : <Text>{elements}</Text>;
  };

  /**
   * Parses the markdown content into React elements
   */
  const parseMarkdown = (): ReactElement[] => {
    const lines = markdown.split('\n');
    const elements: ReactElement[] = [];
    let inList = false;
    let inOrderedList = false;
    let listItems: ReactElement[] = [];
    let orderedListItems: ReactElement[] = [];
    let listCounter = 1;
    let emptyLineCount = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          asHtml ? (
            <ul key={`ul-${elements.length}`} className={getHtmlClass('li')}>
              {listItems}
            </ul>
          ) : (
            <View key={`ul-${elements.length}`}>{listItems}</View>
          )
        );
        listItems = [];
      }
      inList = false;
    };

    const flushOrderedList = () => {
      if (orderedListItems.length > 0) {
        elements.push(
          asHtml ? (
            <ol key={`ol-${elements.length}`} className={getHtmlClass('ol')}>
              {orderedListItems}
            </ol>
          ) : (
            <View key={`ol-${elements.length}`}>{orderedListItems}</View>
          )
        );
        orderedListItems = [];
        listCounter = 1;
      }
      inOrderedList = false;
    };

    const addEmptyLines = (count: number) => {
      if (count > 0) {
        const height = count === 1 ? '0em' : `${(count - 1) * 1.5}em`;
        const pdfHeight = count === 1 ? 8 : (count - 1) * 20;

        elements.push(
          asHtml ? (
            <div key={`empty-${elements.length}`} style={{ height }} />
          ) : (
            <View
              key={`empty-${elements.length}`}
              style={{ height: pdfHeight }}
            />
          )
        );
      }
    };

    lines.forEach((line, i) => {
      if (line.trim() === '') {
        emptyLineCount++;
        return;
      }

      if (emptyLineCount > 0) {
        flushList();
        flushOrderedList();
        addEmptyLines(emptyLineCount);
        emptyLineCount = 0;
      }

      if (line.startsWith('# ')) {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <h1 key={`h1-${i}`} className={getHtmlClass('h1')}>
              {renderTextWithFormatting(line.substring(2))}
            </h1>
          ) : (
            <Text key={`h1-${i}`} style={styles.h1}>
              {line.substring(2)}
            </Text>
          )
        );
        return;
      } else if (line.startsWith('## ')) {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <h2 key={`h2-${i}`} className={getHtmlClass('h2')}>
              {renderTextWithFormatting(line.substring(3))}
            </h2>
          ) : (
            <Text key={`h2-${i}`} style={styles.h2}>
              {line.substring(3)}
            </Text>
          )
        );
        return;
      } else if (line.startsWith('### ')) {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <h3 key={`h3-${i}`} className={getHtmlClass('h3')}>
              {renderTextWithFormatting(line.substring(4))}
            </h3>
          ) : (
            <Text key={`h3-${i}`} style={styles.h3}>
              {line.substring(4)}
            </Text>
          )
        );
        return;
      }

      // Handle unordered lists
      if (line.match(/^[-*]\s/)) {
        flushOrderedList();
        if (!inList) inList = true;
        listItems.push(
          asHtml ? (
            <li key={`li-${i}`} className={getHtmlClass('li')}>
              {renderTextWithFormatting(line.substring(2))}
            </li>
          ) : (
            <View key={`li-${i}`} style={styles.listItem}>
              <Text>• {renderTextWithFormatting(line.substring(2))}</Text>
            </View>
          )
        );
        return;
      }

      // Handle ordered lists
      if (line.match(/^\d+\.\s/)) {
        flushList();
        if (!inOrderedList) inOrderedList = true;
        orderedListItems.push(
          asHtml ? (
            <li key={`oli-${i}`} className={getHtmlClass('li')}>
              {renderTextWithFormatting(line.replace(/^\d+\.\s/, ''))}
            </li>
          ) : (
            <View key={`oli-${i}`} style={styles.orderedListItem}>
              <Text>
                {listCounter++}.{' '}
                {renderTextWithFormatting(line.replace(/^\d+\.\s/, ''))}
              </Text>
            </View>
          )
        );
        return;
      }

      // Handle horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <hr key={`hr-${i}`} className={getHtmlClass('hr')} />
          ) : (
            <View key={`hr-${i}`} style={styles.hr} />
          )
        );
        return;
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <blockquote
              key={`blockquote-${i}`}
              className={getHtmlClass('blockquote')}
            >
              {renderTextWithFormatting(line.substring(2))}
            </blockquote>
          ) : (
            <View key={`blockquote-${i}`} style={styles.blockquote}>
              <Text>{renderTextWithFormatting(line.substring(2))}</Text>
            </View>
          )
        );
        return;
      }

      // If we get here and have list items, flush them first
      flushList();
      flushOrderedList();

      // Handle regular paragraphs
      elements.push(
        asHtml ? (
          <p key={`p-${i}`} className={getHtmlClass('p')}>
            {renderTextWithFormatting(line)}
          </p>
        ) : (
          <View key={`p-${i}`} style={styles.p}>
            {renderTextWithFormatting(line)}
          </View>
        )
      );
    });

    // Flush any remaining list items
    flushList();
    flushOrderedList();

    return elements;
  };

  // Return HTML rendering
  if (asHtml) {
    return <div className="prose max-w-none p-4">{parseMarkdown()}</div>;
  }

  // Return PDF rendering
  return (
    <Document>
      <Page style={styles.page}>
        <View>{parseMarkdown()}</View>
      </Page>
    </Document>
  );
};

// Default export for PDF rendering
const MarkdownPDF = ({ markdown }: { markdown: string }) => (
  <MarkdownRenderer markdown={markdown} />
);

export default MarkdownPDF;
