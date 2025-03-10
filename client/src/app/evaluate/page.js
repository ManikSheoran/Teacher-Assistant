import FormComponent from '../../components/FormComponent';
import Header from "../../components/elements/header";
export default function Home() {
  return (
  
    <>    
    {/* Prevent content from overlapping with the fixed header */}
    <main className="pt-20 px-4">
      <FormComponent />
    </main>
  </>
  );
}





