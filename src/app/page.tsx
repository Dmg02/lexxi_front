import { createClient } from "@/lib/supabase/supabase-server-side";
import { redirect } from 'next/navigation'

export default async function HomePage() {
    const { data, error } = await createClient().auth.getUser();

    if (error || !data?.user) {
        redirect('/login')
    } else {
        redirect('/trials')
    }

    return null
}
