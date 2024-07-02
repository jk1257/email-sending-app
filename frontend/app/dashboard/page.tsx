import CardWrapper from "@/components/CardWrapper"
import PieChartComponent from "@/components/PieChartComponent"

const page = () => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <CardWrapper label="" title="Email Analytics" >
        <PieChartComponent />
        </CardWrapper>
      </div>
    </section>
  )
}

export default page
