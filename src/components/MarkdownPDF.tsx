import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React, { ReactElement } from 'react';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  h1: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  p: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#888',
    marginVertical: 10,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 2,
  },
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    paddingLeft: 8,
    marginLeft: 8,
    fontStyle: 'italic',
    fontSize: 11,
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
  },
  listItem: {
    marginLeft: 12,
    marginBottom: 4,
    fontSize: 12,
  },
  orderedListItem: {
    marginLeft: 12,
    marginBottom: 4,
    fontSize: 12,
  },
  url: {
    color: 'blue',
    textDecoration: 'underline',
  },
});

interface MarkdownPDFProps {
  markdown: string;
  asHtml?: boolean;
}

const getHtmlClass = (elementType: string) => {
  const classMap: Record<string, string> = {
    h1: 'text-2xl font-bold my-4',
    h2: 'text-xl font-bold my-3',
    h3: 'text-lg font-bold my-2',
    p: 'text-base my-2',
    strong: 'font-bold',
    em: 'italic',
    code: 'font-mono bg-gray-100 p-1 rounded',
    blockquote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
    hr: 'my-4 border-t border-gray-300',
    li: 'list-disc ml-5',
    ol: 'list-decimal ml-5',
    a: 'text-blue-600 underline',
    url: 'text-blue-600 underline break-all',
  };
  return classMap[elementType] || '';
};

export const MarkdownRenderer = ({
  markdown,
  asHtml = false,
}: MarkdownPDFProps) => {
  const renderTextWithFormatting = (text: string): ReactElement => {
    const elements: ReactElement[] = [];
    let remainingText = text;

    const processFormatting = (
      regex: RegExp,
      style: any,
      type: 'bold' | 'italic' | 'code' | 'link' | 'italic_alt' | 'bold_italic'
    ): boolean => {
      const match = regex.exec(remainingText);
      if (!match) return false;

      if (match.index > 0) {
        elements.push(
          asHtml ? (
            <span key={`text-${elements.length}`}>
              {remainingText.substring(0, match.index)}
            </span>
          ) : (
            <Text key={`text-${elements.length}`}>
              {remainingText.substring(0, match.index)}
            </Text>
          )
        );
      }

      if (type === 'link') {
        const [_, linkText, url] = match;
        elements.push(
          asHtml ? (
            <a
              key={`link-${elements.length}`}
              href={url}
              className={getHtmlClass('a')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          ) : (
            <Text key={`link-${elements.length}`} style={styles.link}>
              {linkText}
            </Text>
          )
        );
      } else if (type === 'bold_italic') {
        const content = match[1];
        elements.push(
          asHtml ? (
            <span
              key={`bolditalic-${elements.length}`}
              className="font-bold italic"
            >
              {content}
            </span>
          ) : (
            <Text
              key={`bolditalic-${elements.length}`}
              style={{ ...styles.strong, ...styles.em }}
            >
              {content}
            </Text>
          )
        );
      } else {
        const content = type === 'italic_alt' ? match[2] : match[1];
        elements.push(
          asHtml ? (
            <span
              key={`${type}-${elements.length}`}
              className={getHtmlClass(type === 'italic_alt' ? 'em' : type)}
            >
              {content}
            </span>
          ) : (
            <Text key={`${type}-${elements.length}`} style={style}>
              {content}
            </Text>
          )
        );
      }

      remainingText = remainingText.substring(match.index + match[0].length);
      return true;
    };

    while (remainingText.length > 0) {
      // Processa combinação de negrito e itálico
      if (processFormatting(/\*\*\*(.*?)\*\*\*/g, {}, 'bold_italic')) continue;

      // Processa negrito
      if (processFormatting(/\*\*(.*?)\*\*/g, styles.strong, 'bold')) continue;

      // Processa itálico com *
      if (processFormatting(/\*(.*?)\*/g, styles.em, 'italic')) continue;

      // Processa itálico com _
      if (processFormatting(/_(.*?)_/g, styles.em, 'italic_alt')) continue;

      // Processa links
      if (processFormatting(/\[(.*?)\]\((.*?)\)/g, styles.link, 'link'))
        continue;

      // Processa código
      if (processFormatting(/`(.*?)`/g, styles.code, 'code')) continue;

      // Processa URLs soltos (apenas no modo HTML)
      if (asHtml && /https?:\/\//.test(remainingText)) {
        const urlMatch = /(https?:\/\/[^\s]+)/.exec(remainingText);
        if (urlMatch) {
          if (urlMatch.index > 0) {
            elements.push(
              <span key={`text-${elements.length}`}>
                {remainingText.substring(0, urlMatch.index)}
              </span>
            );
          }
          elements.push(
            <a
              key={`url-${elements.length}`}
              href={urlMatch[0]}
              className={getHtmlClass('url')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {urlMatch[0]}
            </a>
          );
          remainingText = remainingText.substring(
            urlMatch.index + urlMatch[0].length
          );
          continue;
        }
      }

      // Texto restante sem formatação
      elements.push(
        asHtml ? (
          <span key={`text-${elements.length}`}>{remainingText}</span>
        ) : (
          <Text key={`text-${elements.length}`}>{remainingText}</Text>
        )
      );
      remainingText = '';
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

    lines.forEach((line, i) => {
      if (line.trim() === '') {
        flushList();
        flushOrderedList();
        return;
      }

      // Títulos
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

      // Listas não ordenadas
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

      // Listas ordenadas
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

      // Linha horizontal
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

      // Blocos de citação
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

      // Se chegou aqui e tem itens na lista, flush primeiro
      flushList();
      flushOrderedList();

      // Parágrafo normal
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

    flushList();
    flushOrderedList();

    return elements;
  };

  if (asHtml) {
    return <div className="prose max-w-none p-4">{parseMarkdown()}</div>;
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
