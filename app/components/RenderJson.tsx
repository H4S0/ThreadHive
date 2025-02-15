import TipTapRenderer from '../components/TipTapRender';

type RenderJsonProps = {
  data: any; // Accepts JSON data from the backend
};

export default function RenderJson({ data }: RenderJsonProps) {
  if (!data) return <p>Loading...</p>; // Handle case where data is not available yet

  return (
    <div>
      <h1>My TipTap Renderer</h1>
      <TipTapRenderer content={data} /> {/* Pass backend data dynamically */}
    </div>
  );
}
