import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  formula: string;
}

export function MathFormula({ formula }: MathFormulaProps) {
  const htmlContent = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: true
  });

  return (
    <div 
      className="my-2 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}
