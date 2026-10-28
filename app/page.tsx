import Approach from "@/components/(HomePage)/Approach";
import Footer from "@/components/(HomePage)/Footer";
import Hero from "@/components/(HomePage)/Hero";
import Navbar from "@/components/(HomePage)/Navbar";
import Philosophy from "@/components/(HomePage)/Philosophy";
import Projects from "@/components/(HomePage)/Projects";
import Skills from "@/components/(HomePage)/Skills";


export default function Home() {
  return (
<>
<Navbar />
<Hero />
<Skills />
<Projects/>
<Approach />
<Philosophy />
<Footer />
</>

  );
}
