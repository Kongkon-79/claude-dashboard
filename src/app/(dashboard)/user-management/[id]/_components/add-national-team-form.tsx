"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import moment from "moment";
import { NationalTeam } from "@/components/types/national-team-career-data-type";
import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type NationalTeamFormValues = {
  teamName: string;
  debut: string;
  goals: number;
  match: number;
  flag: File | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: NationalTeam | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
const nationalTeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  debut: z.string().min(1, "Debut date is required"),
  goals: z
    .number({ message: "Goals must be a number" })
    .min(0, "Goals cannot be negative"),
  match: z
    .number({ message: "Matches must be a number" })
    .min(0, "Matches cannot be negative"),
  flag: z
    .any()
    .nullable()
    .refine((file) => file === null || file instanceof File, "Invalid file"),
});

const AddNationalTeamForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [preview, setPreview] = useState<string | null>(null);
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<NationalTeamFormValues>({
    resolver: zodResolver(nationalTeamSchema),
    defaultValues: {
      teamName: "",
      debut: "",
      goals: 0,
      match: 0,
      flag: null,
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        teamName: defaultData.teamName,
        debut: moment(defaultData.debut).format("YYYY-MM-DD"),
        goals: defaultData.goals,
        match: defaultData.match,
        flag: null,
      });
      setPreview(defaultData.flag);
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: NationalTeamFormValues) => {
      const formData = new FormData();
      formData.append("teamName", values.teamName);
      formData.append("debut", values.debut);
      formData.append("goals", String(values.goals));
      formData.append("match", String(values.match));
      if (values.flag) formData.append("flag", values.flag);

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${playerId}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "National team updated" : "National team added");
      queryClient.invalidateQueries({ queryKey: ["all-national-team-career"] });
      onOpenChange(false);
      form.reset();
      setPreview(null);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit National Team Career" : "Add National Team Career"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="space-y-4"
          >
            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Team Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      {...field}
                      placeholder="Enter team name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Debut */}
            <FormField
              control={form.control}
              name="debut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Debut Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goals & Match */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Goals
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Matches
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Flag Upload */}
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Team Flag
                  </FormLabel>
                  <FormControl>
                    <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                      {preview ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          <Image
                            src={preview}
                            alt="Flag"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setPreview(null);
                                field.onChange(null);
                              }}
                              className="bg-white rounded-full p-2"
                            >
                              <X className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
                          <UploadCloud className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium text-[#131313] leading-normal">
                            Upload Flag
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              field.onChange(file);
                              const url = URL.createObjectURL(file);
                              setPreview(url);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setPreview(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNationalTeamForm;











// "use client";

// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import { UploadCloud, X } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import moment from "moment";
// import { NationalTeam } from "@/components/types/national-team-career-data-type";
// import { useSession } from "next-auth/react";

// type NationalTeamFormValues = {
//   teamName: string;
//   debut: string;
//   goals: number;
//   match: number;
//   flag: File | null;
// };

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   defaultData?: NationalTeam | null;
//   playerId?: string;
// }

// const AddNationalTeamForm = ({
//   open,
//   onOpenChange,
//   defaultData,
//   playerId,
// }: Props) => {
//   const queryClient = useQueryClient();
//   const session = useSession();
//   const token = (session?.data?.user as { accessToken: string })?.accessToken;

//   const [preview, setPreview] = useState<string | null>(null);
//   const isEdit = Boolean(defaultData?._id);

//   const form = useForm<NationalTeamFormValues>({
//     defaultValues: {
//       teamName: "",
//       debut: "",
//       goals: 0,
//       match: 0,
//       flag: null,
//     },
//   });

//   // 🔁 Edit mode prefill
//   useEffect(() => {
//     if (defaultData) {
//       form.reset({
//         teamName: defaultData.teamName,
//         debut: moment(defaultData.debut).format("YYYY-MM-DD"),
//         goals: defaultData.goals,
//         match: defaultData.match,
//         flag: null,
//       });
//       setPreview(defaultData.flag);
//     }
//   }, [defaultData, form]);

//   // 🔥 Add / Update mutation
//   const { mutate, isPending } = useMutation({
//     mutationFn: async (values: NationalTeamFormValues) => {
//       const formData = new FormData();
//       formData.append("teamName", values.teamName);
//       formData.append("debut", values.debut);
//       formData.append("goals", String(values.goals));
//       formData.append("match", String(values.match));
//       if (values.flag) formData.append("flag", values.flag);

//       const url = isEdit
//         ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${defaultData?._id}`
//         : `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${playerId}`;

//       const method = isEdit ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       return res.json();
//     },
//     onSuccess: (data) => {
//       if (!data?.success) {
//         toast.error(data?.message || "Something went wrong");
//         return;
//       }

//       toast.success(isEdit ? "National team updated" : "National team added");
//       queryClient.invalidateQueries({ queryKey: ["all-national-team-career"] });
//       onOpenChange(false);
//       form.reset();
//       setPreview(null);
//     },
//   });

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg rounded-2xl">
//         <h3 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit National Team Career" : "Add National Team Career"}
//         </h3>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit((values) => mutate(values))}
//             className="space-y-4"
//           >
//             {/* Team Name */}
//             <FormField
//               control={form.control}
//               name="teamName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
//                     Team Name
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
//                       {...field}
//                       placeholder="Enter team name"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Debut */}
//             <FormField
//               control={form.control}
//               name="debut"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
//                     Debut Date
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
//                       type="date"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Goals & Match */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="goals"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
//                       Goals
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
//                         type="number"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="match"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
//                       Matches
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
//                         type="number"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Flag Upload */}
//             <FormField
//               control={form.control}
//               name="flag"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
//                     Team Flag
//                   </FormLabel>
//                   <FormControl>
//                     <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
//                       {preview ? (
//                         <div className="relative w-full h-28 rounded-xl overflow-hidden group">
//                           <Image
//                             src={preview}
//                             alt="Flag"
//                             fill
//                             className="object-cover"
//                           />
//                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setPreview(null);
//                                 field.onChange(null);
//                               }}
//                               className="bg-white rounded-full p-2"
//                             >
//                               <X className="h-5 w-5 text-red-600" />
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
//                           <UploadCloud className="h-6 w-6 text-muted-foreground" />
//                           <span className="text-sm font-medium text-[#131313] leading-normal">
//                             Upload Flag
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             hidden
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (!file) return;
//                               field.onChange(file);
//                               const url = URL.createObjectURL(file);
//                               setPreview(url);
//                             }}
//                           />
//                         </label>
//                       )}
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Actions */}
//             <div className="flex justify-end gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   onOpenChange(false);
//                   setPreview(null);
//                   form.reset();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isPending}>
//                 {isEdit ? "Update" : "Add"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddNationalTeamForm;






