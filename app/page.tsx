import About from "@/components/(HomePage)/About";
import Approach from "@/components/(HomePage)/Approach";
import EducationExperience from "@/components/(HomePage)/EducationExperience";
import Footer from "@/components/(HomePage)/Footer";
import Hero from "@/components/(HomePage)/Hero";

import Milestones from "@/components/(HomePage)/Milestones";
import Navbar from "@/components/(HomePage)/Navbar";
import Philosophy from "@/components/(HomePage)/Philosophy";
import Projects from "@/components/(HomePage)/Projects";
import Skills from "@/components/(HomePage)/Skills";


export default function Home() {
  return (
<>
<Navbar />
<Hero />
<About />
<EducationExperience />
<Milestones />
<Skills />
<Projects/>
<Approach />
<Philosophy />
<Footer />

</>

  );
}
