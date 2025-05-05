import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import React, { ReactElement } from 'react';

const propsH1 = {
  size: 14,
  margin: 16,
};

const propsH2 = {
  size: 12,
  margin: 12,
};

const propsH3 = {
  size: 10,
  margin: 8,
};

const propsP = {
  size: 8,
  margin: 0,
};

const sizeCode = 7;
const sizeBlockquote = 7;
const sizeListItem = 8;

const multiplySizeOnPreview = 1.5;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  h1: {
    fontSize: propsH1.size,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: propsH2.size,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: propsH3.size,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  p: {
    fontSize: propsP.size,
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
    marginVertical: 3,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 4,
    fontSize: sizeCode,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#d1d5db',
    paddingLeft: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    fontSize: sizeBlockquote,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: sizeListItem,
  },
  orderedListItem: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: sizeListItem,
  },
  url: {
    color: '#2563eb',
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
});

// Estilos para HTML
const htmlStyles = {
  h1: {
    fontSize: `${propsH1.size * multiplySizeOnPreview}px`,
    fontWeight: 'bold',
    marginBottom: `${propsH1.margin}px`,
    marginTop: `${propsH1.margin}px`,
  },
  h2: {
    fontSize: `${propsH2.size * multiplySizeOnPreview}px`,
    fontWeight: 'bold',
    marginBottom: `${propsH2.margin}px`,
    marginTop: `${propsH2.margin}px`,
  },
  h3: {
    fontSize: `${propsH3.size * multiplySizeOnPreview}px`,
    fontWeight: 'bold',
    marginBottom: `${propsH3.margin}px`,
    marginTop: `${propsH3.margin}px`,
  },
  p: {
    fontSize: `${propsP.size * multiplySizeOnPreview}px`,
    marginBottom: `${propsP.margin}px`,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  code: {
    fontFamily: 'Courier, monospace',
    backgroundColor: '#f5f5f5',
    padding: '4px',
    borderRadius: '4px',
    fontSize: `${sizeCode * multiplySizeOnPreview}px`,
  },
  blockquote: {
    borderLeft: '4px solid #d1d5db',
    paddingLeft: '16px',
    fontStyle: 'italic',
    color: '#4b5563',
    fontSize: `${sizeBlockquote * multiplySizeOnPreview}px`,
  },
  hr: {
    margin: '16px 0',
    borderTop: '1px solid #e2e8f0',
  },
  li: {
    marginLeft: '20px',
    marginBottom: '4px',
    fontSize: `${sizeListItem * multiplySizeOnPreview}px`,
    listStyleType: 'disc',
  },
  ol: {
    marginLeft: '20px',
    marginBottom: '4px',
    fontSize: `${sizeListItem * multiplySizeOnPreview}px`,
    listStyleType: 'decimal',
  },
  a: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  url: {
    color: '#2563eb',
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
};

interface MarkdownPDFProps {
  markdown: string;
  asHtml?: boolean;
}

export const MarkdownRenderer = ({
  markdown,
  asHtml = false,
}: MarkdownPDFProps) => {
  const renderTextWithFormatting = (text: string): ReactElement => {
    const elements: ReactElement[] = [];
    let remainingText = text;

    const regexes: Array<{
      regex: RegExp;
      render: (
        content: string,
        key: string,
        match: RegExpExecArray
      ) => ReactElement;
    }> = [
      {
        regex: /\*\*\*(.+?)\*\*\*/,
        render: (content, key) =>
          asHtml ? (
            <span key={key} style={{ ...htmlStyles.strong, ...htmlStyles.em }}>
              {content}
            </span>
          ) : (
            <Text key={key} style={[styles.strong, styles.em]}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*\*_(.+?)_\*\*/,
        render: (content, key) =>
          asHtml ? (
            <span key={key} style={{ ...htmlStyles.strong, ...htmlStyles.em }}>
              {content}
            </span>
          ) : (
            <Text key={key} style={[styles.strong, styles.em]}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*\*(.+?)\*\*/,
        render: (content, key) =>
          asHtml ? (
            <span key={key} style={htmlStyles.strong}>
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.strong}>
              {content}
            </Text>
          ),
      },
      {
        regex: /_(.+?)_/,
        render: (content, key) =>
          asHtml ? (
            <span key={key} style={htmlStyles.em}>
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.em}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\*(.+?)\*/,
        render: (content, key) =>
          asHtml ? (
            <span key={key} style={htmlStyles.em}>
              {content}
            </span>
          ) : (
            <Text key={key} style={styles.em}>
              {content}
            </Text>
          ),
      },
      {
        regex: /`(.+?)`/,
        render: (content, key) =>
          asHtml ? (
            <code key={key} style={htmlStyles.code}>
              {content}
            </code>
          ) : (
            <Text key={key} style={styles.code}>
              {content}
            </Text>
          ),
      },
      {
        regex: /\[(.+?)\]\((.+?)\)/,
        render: (content, key, match) =>
          asHtml ? (
            <a
              key={key}
              href={match[2]}
              style={htmlStyles.a}
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

    while (remainingText.length > 0) {
      let matched = false;

      for (const { regex, render } of regexes) {
        const match = regex.exec(remainingText);
        if (match) {
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

          elements.push(render(match[1], `match-${elements.length}`, match));
          remainingText = remainingText.substring(
            match.index + match[0].length
          );
          matched = true;
          break;
        }
      }

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
            <ul key={`ul-${elements.length}`} style={{ padding: 0, margin: 0 }}>
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
            <ol key={`ol-${elements.length}`} style={{ padding: 0, margin: 0 }}>
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
            <h1 key={`h1-${i}`} style={htmlStyles.h1}>
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
            <h2 key={`h2-${i}`} style={htmlStyles.h2}>
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
            <h3 key={`h3-${i}`} style={htmlStyles.h3}>
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

      if (line.match(/^[-*]\s/)) {
        flushOrderedList();
        if (!inList) inList = true;
        listItems.push(
          asHtml ? (
            <li key={`li-${i}`} style={htmlStyles.li}>
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

      if (line.match(/^\d+\.\s/)) {
        flushList();
        if (!inOrderedList) inOrderedList = true;
        orderedListItems.push(
          asHtml ? (
            <li key={`oli-${i}`} style={htmlStyles.ol}>
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

      if (line.trim() === '---' || line.trim() === '***') {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <hr key={`hr-${i}`} style={htmlStyles.hr} />
          ) : (
            <View key={`hr-${i}`} style={styles.hr} />
          )
        );
        return;
      }

      if (line.startsWith('> ')) {
        flushList();
        flushOrderedList();
        elements.push(
          asHtml ? (
            <blockquote key={`blockquote-${i}`} style={htmlStyles.blockquote}>
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

      flushList();
      flushOrderedList();

      elements.push(
        asHtml ? (
          <p key={`p-${i}`} style={htmlStyles.p}>
            {renderTextWithFormatting(line)}
          </p>
        ) : (
          <View key={`p-${i}`} style={styles.p}>
            {renderTextWithFormatting(line)}
          </View>
        )
      );
    });

    flushList();
    flushOrderedList();

    return elements;
  };

  if (asHtml) {
    return <div style={{ padding: '16px' }}>{parseMarkdown()}</div>;
  }

  return (
    <Document>
      <Page style={styles.page}>
        <View>{parseMarkdown()}</View>
      </Page>
    </Document>
  );
};

const MarkdownPDF = ({ markdown }: { markdown: string }) => (
  <MarkdownRenderer markdown={markdown} />
);

export default MarkdownPDF;
