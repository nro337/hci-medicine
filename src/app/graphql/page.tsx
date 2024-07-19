import { Suspense } from "react"
import { fetchDesignTokens, loginGH } from "./queries"



const GraphQLPage = async () => {
  const res = await loginGH()
  // TODO Move this to run on prestart or prebuild
  // const out = await fetchDesignTokens()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {res.name}
      </div>
  </Suspense>
  )
}

export default GraphQLPage