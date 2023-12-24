"use client";

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

type Props = {
  content: string;
}

const MarkdownResponse = ({ content }: Props) => {
  return (
    <ReactMarkdown
      className="text-sm overflow-hidden leading-7"
      components={{
        code({ node, className, children, inline, ...rest }) {
          const match = /language-(w+)/.exec(className || '');
          return !inline && match ?
            <SyntaxHighlighter
              {...rest}
              style={atomDark}
              wrapLongLines
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
            :
            <code {...rest} className={className}>
              {children}
            </code>
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownResponse