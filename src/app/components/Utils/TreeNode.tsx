// TreeNode.tsx

import React from 'react';
import '../../../../styles/TreeNode.css';

interface TreeNodeProps {
  value: string;
  hasChildren: boolean;
  children?: React.ReactNode
}

const TreeNode: React.FC<TreeNodeProps> = ({ value, hasChildren, children }) => {
  return (
    <div className="node">
      {value}
      {hasChildren && <div className="arrow" />}
      {children}
    </div>
  );
};

export default TreeNode;
