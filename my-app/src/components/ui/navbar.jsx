import { Button } from "@/components/ui/button"

export default function NavBar() {
    return (
        <div className='p-3 grid grid-cols-2'>
            <div>
                <Button variant="outline" className="shadow-md"> Tour Guide </Button>
            </div>
            <div>
                <Button variant="outline">Sign In</Button>
            </div>
        </div>
    )
}