import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster, toast } from 'sonner'

// Styles
import './App.css'

// Components
import Home from '@/pages'

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) =>
            toast.error(`Something went wrong: ${error.message}`),
    }),
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <Home />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
