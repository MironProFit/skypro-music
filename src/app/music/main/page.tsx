import ProtectedRoute from '@components/ProtectedRoute/ProtectedRoute'
import TrackList from '@components/TrackList/TrackList'

export default function MainPage() {
  return (
    <>
      {/* <ProtectedRoute> */}
      <TrackList />
      {/* </ProtectedRoute> */}
    </>
  )
}
