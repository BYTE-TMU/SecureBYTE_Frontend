import { columns } from '../custom-components/individual-project-table/columns';
import IndividualProjectTable from '../custom-components/individual-project-table/IndividualProjectTable';
import { useParams } from 'react-router';
import { useGetSubmissions } from '@/hooks/useGetSubmissions';

export default function IndividualProjectPage() {
  let { projectId } = useParams();
  const { submissions } = useGetSubmissions(projectId);

  console.log('inside indiv project');
  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">Project</h1>
      <IndividualProjectTable columns={columns} data={submissions} />
    </main>
  );
}
