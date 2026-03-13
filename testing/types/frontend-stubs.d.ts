// ambient declarations to prevent the test ts project from type-checking the entire frontend

// The import specifiers in tests use two-level relative paths (e.g. '../../frontend/...').
// We capture those patterns here so the actual source files are replaced with `any`.
declare module "../../frontend/src/app/pages/*" {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module "../../frontend/src/app/components/ui/*" {
  const whatever: any;
  export default whatever;
}

declare module "../../frontend/src/app/services/*" {
  const whatever: any;
  export default whatever;
}

// also guard alias imports that appear inside frontend code
// this prevents ts from resolving aliased modules and dragging full frontend types
declare module "@/app/*" {
  const whatever: any;
  export default whatever;
}
