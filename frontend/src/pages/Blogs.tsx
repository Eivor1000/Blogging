import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/skeletons";
import { useBlogs } from "../hooks"

export const Blogs = () =>{
    const {loading,blogs} = useBlogs();
    if(loading){
        
        return <div><Appbar/><div className="flex justify-center">
            <div>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            </div>
        </div>
        </div>
    }
    return <div><Appbar/>
    <div className="flex justify-center">
        <div className="max-w-wl">
            {blogs.map(blog => <BlogCard
        id={blog.id}
        authorName={blog.author.name || "anonymous"}
        title={blog.title}
        content={blog.content}
        publishedDate={"Dec 3, 2023"}/>)}
    </div>
    </div>
    </div>
}