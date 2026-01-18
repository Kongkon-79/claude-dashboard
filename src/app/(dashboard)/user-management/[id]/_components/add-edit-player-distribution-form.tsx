"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DistributionStats } from "@/components/types/player-distribution-stats-data-type";

type PlayerDistributionFormValues = {
     passes: number;
  passesinFinalThird: number;
  passesinMiddleThird: number;
  passesinOerensiveThird: number;

  kevPasses: number;
  longPasses: number;
  mediumPasses: number;
  shortPasses: number;

  passesForward: number;
  passesSidewavs: number;
  passesBackward: number;

  passesReceived: number;
  crosses: number;
  stepIn: number;
  turnoverConceded: number;
  mostPassesPlayerBetween: number;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: DistributionStats | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
export const PlayerDistributionSchema = z.object({
  passes: z
    .number({ message: "Passes must be a number" })
    .min(0, "Passes cannot be negative"),

  passesinFinalThird: z
    .number({ message: "Passes in final third must be a number" })
    .min(0, "Passes in final third cannot be negative"),

  passesinMiddleThird: z
    .number({ message: "Passes in middle third must be a number" })
    .min(0, "Passes in middle third cannot be negative"),

  passesinOerensiveThird: z
    .number({ message: "Passes in offensive third must be a number" })
    .min(0, "Passes in offensive third cannot be negative"),

  kevPasses: z
    .number({ message: "Key passes must be a number" })
    .min(0, "Key passes cannot be negative"),

  longPasses: z
    .number({ message: "Long passes must be a number" })
    .min(0, "Long passes cannot be negative"),

  mediumPasses: z
    .number({ message: "Medium passes must be a number" })
    .min(0, "Medium passes cannot be negative"),

  shortPasses: z
    .number({ message: "Short passes must be a number" })
    .min(0, "Short passes cannot be negative"),

  passesForward: z
    .number({ message: "Forward passes must be a number" })
    .min(0, "Forward passes cannot be negative"),

  passesSidewavs: z
    .number({ message: "Sideways passes must be a number" })
    .min(0, "Sideways passes cannot be negative"),

  passesBackward: z
    .number({ message: "Backward passes must be a number" })
    .min(0, "Backward passes cannot be negative"),

  passesReceived: z
    .number({ message: "Passes received must be a number" })
    .min(0, "Passes received cannot be negative"),

  crosses: z
    .number({ message: "Crosses must be a number" })
    .min(0, "Crosses cannot be negative"),

  stepIn: z
    .number({ message: "Step-ins must be a number" })
    .min(0, "Step-ins cannot be negative"),

  turnoverConceded: z
    .number({ message: "Turnovers conceded must be a number" })
    .min(0, "Turnovers conceded cannot be negative"),

  mostPassesPlayerBetween: z
    .number({ message: "Most passes between players must be a number" })
    .min(0, "Most passes between players cannot be negative"),
});


const AddEditPlayerDistributionForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<PlayerDistributionFormValues>({
    resolver: zodResolver(PlayerDistributionSchema),
 defaultValues: {
  passes: 0,
  passesinFinalThird: 0,
  passesinMiddleThird: 0,
  passesinOerensiveThird: 0,

  kevPasses: 0,
  longPasses: 0,
  mediumPasses: 0,
  shortPasses: 0,

  passesForward: 0,
  passesSidewavs: 0,
  passesBackward: 0,

  passesReceived: 0,
  crosses: 0,
  stepIn: 0,
  turnoverConceded: 0,
  mostPassesPlayerBetween: 0,
}



  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
    form.reset({
  passes: defaultData?.passes ?? 0,
  passesinFinalThird: defaultData?.passesinFinalThird ?? 0,
  passesinMiddleThird: defaultData?.passesinMiddleThird ?? 0,
  passesinOerensiveThird: defaultData?.passesinOerensiveThird ?? 0,

  kevPasses: defaultData?.kevPasses ?? 0,
  longPasses: defaultData?.longPasses ?? 0,
  mediumPasses: defaultData?.mediumPasses ?? 0,
  shortPasses: defaultData?.shortPasses ?? 0,

  passesForward: defaultData?.passesForward ?? 0,
  passesSidewavs: defaultData?.passesSidewavs ?? 0,
  passesBackward: defaultData?.passesBackward ?? 0,

  passesReceived: defaultData?.passesReceived ?? 0,
  crosses: defaultData?.crosses ?? 0,
  stepIn: defaultData?.stepIn ?? 0,
  turnoverConceded: defaultData?.turnoverConceded ?? 0,
  mostPassesPlayerBetween: defaultData?.mostPassesPlayerBetween ?? 0,
});




    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PlayerDistributionFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/distributionstats/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/distributionstats/${playerId}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json", // 🔥 important
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values), // 🔥 send JSON
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "Player Distribution Stats updated" : "Player Distribution Stats added");
      queryClient.invalidateQueries({ queryKey: ["all-distributionstats"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-h-[400px] md:max-h-[600px] overflow-auto max-w-2xl rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Player Distribution Stats" : "Add Player Distribution Stats"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="passes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes
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
                name="passesinFinalThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes in Final Third
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
                name="passesinMiddleThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes in Middle Third
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
                name="passesinOerensiveThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes in Defensive Third
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
                name="kevPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                     Kev Passes
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
                name="longPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                        Long Passes
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
                name="mediumPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Medium Passes
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
              name="shortPasses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Short Passes
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
                name="passesForward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Forward
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
                name="passesSidewavs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Sidewavs
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
                name="passesBackward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Backward
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
                name="passesReceived"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Received
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
              name="crosses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Crosses
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
                name="stepIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Step In   
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
                name="turnoverConceded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Turnover Conceded
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
                name="mostPassesPlayerBetween"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Most Passes Player Between
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

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
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

export default AddEditPlayerDistributionForm;

