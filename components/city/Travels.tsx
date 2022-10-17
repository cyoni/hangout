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
    placeIds: [place?.placeId],
  })

  const travelers = cityItineraryQuery.data
  const hasData =
    Array.isArray(travelers?.pages) && travelers.pages[0]?.travelers?.length > 0

  console.log("travelers", travelers)
  const placeIds: string[] = travelers?.pages.map((page) =>
    page?.travelers?.map((travel) => travel.profile[0].placeId)
  )

  const { places, getPlaceFromObject, placeQuery } = usePlace(placeIds)

  const isLoading = cityItineraryQuery.isFetching

  console.log("travelers city ids", placeIds)

  return (
    <div className="mx-auto w-[60%]">
      <div className="flex justify-between">
        <div className="text-2xl">Travelers</div>
        <button
          className="btn"
          onClick={() => router.push(`/publish-hangout/city/${place.cityId}`)}
        >
          Add travel
        </button>
      </div>
      <div className="mt-4 min-h-[700px] rounded-md bg-gray-50 py-5 px-10 shadow-md flex flex-col justify-between">
        {!travelers && <Spinner className="top-0 left-1/2 mt-10" />}
        {hasData && travelers.pages.length > 0 && (
          <>
            <div className="grid grid-cols-[300px_300px] items-center justify-center gap-10">
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
              externalClass={`btn block mx-auto mb-2 w-fit ${
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
          <div className=" my-20 text-center text-3xl ">No itineraries yet</div>
        )}
      </div>
    </div>
  )
}

export default Travels
