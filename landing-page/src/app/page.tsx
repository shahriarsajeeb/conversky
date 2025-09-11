import { Features } from "@/modules/features"
import Footer from "@/modules/footer"
import { Hero } from "@/modules/hero"

const Page = () => {
  return (
    <main className="font-body">
      <Hero />
      <Features />
      <Footer /> 
    </main>
  )
}

export default Page