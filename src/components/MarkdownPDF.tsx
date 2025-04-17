import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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
    marginBottom: 10,
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
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 2,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
    marginLeft: 10,
    fontStyle: 'italic',
  },
});

interface MarkdownPDFProps {
  markdown: string;
}

const MarkdownPDF = ({ markdown }: MarkdownPDFProps) => {
  const parseMarkdown = () => {
    const blocks = markdown.split(/\n\s*\n/);
    return blocks.map((block, i) => {
      if (block.startsWith('# ')) {
        return (
          <Text key={i} style={styles.h1}>
            {block.substring(2)}
          </Text>
        );
      } else if (block.startsWith('## ')) {
        return (
          <Text key={i} style={styles.h2}>
            {block.substring(3)}
          </Text>
        );
      } else if (block.startsWith('### ')) {
        return (
          <Text key={i} style={styles.h3}>
            {block.substring(4)}
          </Text>
        );
      }

      // const boldItalicText = block
      //   .replace(/\*\*(.*?)\*\*/g, (_, p1) => {
      //     return `<Text style="${JSON.stringify(styles.strong)}">${p1}</Text>`;
      //   })
      //   .replace(/\*(.*?)\*/g, (_, p1) => {
      //     return `<Text style="${JSON.stringify(styles.em)}">${p1}</Text>`;
      //   });

      // const codeText = boldItalicText.replace(/`(.*?)`/g, (_, p1) => {
      //   return `<Text style="${JSON.stringify(styles.code)}">${p1}</Text>`;
      // });

      if (block.trim() === '---' || block.trim() === '***') {
        return <View key={i} style={styles.hr} />;
      }

      if (block.startsWith('> ')) {
        return (
          <View key={i} style={styles.blockquote}>
            <Text>{block.substring(2)}</Text>
          </View>
        );
      }

      return (
        <Text key={i} style={styles.p}>
          {block}
        </Text>
      );
    });
  };

  return (
    <Document>
      <Page style={styles.page}>
        <View>{parseMarkdown()}</View>
      </Page>
    </Document>
  );
};

export default MarkdownPDF;
