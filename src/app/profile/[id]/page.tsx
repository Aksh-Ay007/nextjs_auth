
export default function UserProfile({params}:string){

    return (
        <div>
        <h1>Profile Page</h1>
        <p>This is the user profile page

            <span>{params.id}</span>
        </p>
        </div>
    );
}