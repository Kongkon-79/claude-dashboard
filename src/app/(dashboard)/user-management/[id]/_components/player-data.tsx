import React from 'react'
import { User } from './single-user-data-type'
import Image from 'next/image'
import moment from 'moment'
import PlayingVideosPage from './playing-videos'

const PlayerData = ({ data }: { data: User }) => {
  console.log("view data", data)
  return (
    <div>
      <div className='bg-white shadow[0px_4px_16px_0px_#00000029] rounded-[16px] grid grid-cols-1 md:grid-cols-4 gap-10 p-6 border'>
        <div className="md:col-span-1">
          <Image src={data?.profileImage || "/assets/images/no-user.jpg"} alt={data?.firstName || "profile image"} width={1000} height={1000} className="w-full h-[400px] object-cover rounded-[16px]" />
        </div>
        <div className="md:col-span-3">
          <ul className="grid gris-cols-1 md:gris-cols-2 lg:grid-cols-4 gap-6">
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Full Name</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.firstName || "N/A"}  {data?.lastName || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Phone</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.phone || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Nationality</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.citizenship || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Preferred Foot</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.foot || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Current Club</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.currentClub || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>GPA</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.gpa || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Place of birth</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.birthdayPlace || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Weight</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.weight || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Category</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.category || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Agent</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.agent || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Social media</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.gpa || "N/A"}</span></li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Age
              </span>
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%]">
                {moment(data?.dob).format("DD MMM YYYY") || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Height</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.hight || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Position</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.position.join(", ") || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>League</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.league || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Gender</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.gender || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Institute Name</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.institute || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Role</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.role || "N/A"}</span></li>
            <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Email</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.email || "N/A"}</span></li>

          </ul>
        </div>
      </div>

      <PlayingVideosPage videos={data?.playingVideo}/>
    </div>
  )
}

export default PlayerData





// import React from "react";
// import { User } from "./single-user-data-type";
// import Image from "next/image";
// import moment from "moment";
// import PlayingVideosPage from "./playing-videos";

// const PlayerData = ({ data }: { data: User }) => {
//   const calculateAge = (dob: string) => {
//     if (!dob) return "N/A";
//     return moment().diff(dob, "years");
//   };

//   return (
//     <div className="space-y-8">
//       {/* Profile & Details */}
//       <div className="bg-white shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-10 p-8 border">
//         <div className="md:col-span-1">
//           <Image
//             src={data?.profileImage || "/assets/images/no-user.jpg"}
//             alt={`${data?.firstName || "Player"} profile`}
//             width={1000}
//             height={1000}
//             className="w-full h-[400px] object-cover rounded-2xl"
//           />
//         </div>

//         <div className="md:col-span-3">
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Full Name</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.firstName} {data?.lastName}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Age</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {calculateAge(data?.dob)} years
//                 <span className="block text-sm text-gray-500">
//                   ({moment(data?.dob).format("DD MMM YYYY")})
//                 </span>
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Position</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.position?.join(", ") || "N/A"}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Preferred Foot</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.foot || "N/A"}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Height</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.hight || "N/A"}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Weight</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.weight || "N/A"}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Current Club</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.currentClub || "N/A"}
//               </span>
//             </li>

//             <li className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-[#616161]">Nationality</span>
//               <span className="text-lg font-semibold text-[#131313]">
//                 {data?.citizenship || "N/A"}
//               </span>
//             </li>

//             {/* Add more fields as needed... */}
//           </ul>
//         </div>
//       </div>

//       {/* Playing Videos Section */}
//       <PlayingVideosPage videos={data?.playingVideo} />
//     </div>
//   );
// };

// export default PlayerData;