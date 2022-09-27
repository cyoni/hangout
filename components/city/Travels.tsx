import { useRouter } from "next/router"
import ButtonIntegration from "../Buttons/ButtonIntegration"
import Spinner from "../Loaders/Spinner"
import useItinerary from "../Hooks/useItinerary"
import usePlace from "../Hooks/usePlace"
import TravelItem from "./TravelItem"

function Travels({ place }) {
  const router = useRouter()

  const { cityItineraryQuery } = useItinerary({
    isCity: true,
    cityIds: [place.city_id],
  })

  const travelers = cityItineraryQuery.data
  const hasData =
    Array.isArray(travelers?.pages) && travelers.pages[0]?.travelers?.length > 0

  console.log("travelers", travelers)
  const cityIds: number[] = travelers?.pages.map((page) =>
    page?.travelers?.map((travel) => travel.profile[0].cityId)
  )

  const { places, getPlaceFromObject, placeQuery } = usePlace([cityIds])

  const isLoading = cityItineraryQuery.isFetching

  console.log("travelers city ids", cityIds)

  return (
    <div className="mx-auto w-[60%]">
      <div className="flex justify-between">
        <div className="text-2xl">Travelers</div>
        <button
          className="btn"
          onClick={() => router.push(`/publish-hangout/city/${place.city_id}`)}
        >
          Add travel
        </button>
      </div>
      <div className=" mt-4 min-h-[700px] rounded-md bg-gray-50 py-5 px-10 shadow-md">
        {!travelers && <Spinner className="top-0 left-1/2 mt-10" />}
        {hasData && travelers.pages.length > 0 && (
          <>
            <div className="grid grid-cols-[300px_300px] gap-10 justify-center items-center">
              {travelers.pages.map((page) =>
                page.travelers.map((item, i) => (
                  <TravelItem
                    key={i}
                    item={item}
                    getPlaceFromObject={getPlaceFromObject}
                  />
                ))
              )}
            </div>
            <ButtonIntegration
              externalClass={`btn block mx-auto mt-10 w-fit ${
                !cityItineraryQuery.hasNextPage ? "disabled" : ""
              }`}
              disabled={!cityItineraryQuery.hasNextPage}
              onClick={() => cityItineraryQuery.fetchNextPage()}
            >
              Show more
            </ButtonIntegration>
          </>
        )}

        {!isLoading && !hasData && (
          <div className=" my-20 text-center text-3xl ">
            No travelers yet
            <p>
              <button className="btn mt-7">Invite a friend</button>
            </p>
          </div>
        )}
      </div>
      <div className="link w-fit">
        {/* <Link
                href={`/more-travels?country=${location?.country}&state=${location?.state}&city=${location?.city}`}
              >
                More
              </Link> */}
      </div>
    </div>
  )
}

export default Travels
