import { useMemo } from 'react';
import { useGetSubmissions } from './useGetSubmissions';

export function useGetFileStructure(projectId) {
  const { submissions, error, refetch } = useGetSubmissions(projectId);

  const fileTree = useMemo(() => {
    const tree = {};

    submissions.forEach((submission) => {
      // If theres no filename, then skip
      if (!submission.filename) return;

      // Get parts of the path with the final being the filename
      const pathParts = submission.filename.split('/');

      // let the current level be the root initially and then traverse down as we go
      let currentLevel = tree;

      pathParts.forEach((part, index) => {
        // if the index of the part is the same as the length of the path-1 then its a file
        if (index === pathParts.length - 1) {
          // This is a file because its the last part of the path
          currentLevel[part] = {
            type: 'file',
            name: part,
            path: submission.filename,
            content: submission.code,
          };
        } else {
          // This is a folder because if its not the last part of the path then its a folder
          // Check if this folder already exists
          if (!currentLevel[part]) {
            // if its not in the current level already, then add as a folder with the children empty for now
            currentLevel[part] = {
              type: 'folder',
              name: part,
              children: {},
              path: pathParts.slice(0, index + 1).join('/'),
            };
          }

          // We just added a folder, so now we go into that folder to add more files/folders
          currentLevel = currentLevel[part].children;
        }
      });
    });
    return tree;
  }, [submissions]);

  return { tree: fileTree };
}
