import React from 'react'
import DashboardOverviewHeader from './_components/dashboard-overview-header'
import { DashboardOverview } from './_components/dashboard-overview'
import { RevenueActivity } from './_components/revenue-activity'
import PricingAndPayment from './_components/pricing-and-payment'
import UserRegistration from './_components/user-registrations'

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardOverviewHeader/>
      <DashboardOverview/>
      <RevenueActivity/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PricingAndPayment/>
        <UserRegistration/>
      </div>
    </div>
  )
}

export default DashboardOverviewPage