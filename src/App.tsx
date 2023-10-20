import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster, toast } from 'sonner'

// Styles
import './App.css'

// Contexts
import { NotificationsUpdateContextProvider } from '@/contexts/NotificationsUpdateContext'

// Pages
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
            <NotificationsUpdateContextProvider>
                <Toaster />
                <Home />
                <ReactQueryDevtools initialIsOpen={false} />
            </NotificationsUpdateContextProvider>
        </QueryClientProvider>
    )
}

export default App
