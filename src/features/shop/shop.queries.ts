import { queryOptions } from '@tanstack/react-query';
import {
  getEmployeeDashboardFn,
  getMyInvitationsFn,
  getShopDashboardFn,
  getShopEmployeesFn,
} from './shop.functions';

export const shopKeys = {
  all: ['shop'] as const,
  dashboards: () => [...shopKeys.all, 'dashboard'] as const,
  dashboard: (shopId: string) => [...shopKeys.dashboards(), shopId] as const,
  employees: () => [...shopKeys.all, 'employees'] as const,
  employeeList: (shopId: string) => [...shopKeys.employees(), shopId] as const,
  invitations: () => [...shopKeys.all, 'invitations'] as const,
  myInvitations: () => [...shopKeys.invitations(), 'mine'] as const,
  employeeDashboard: () => [...shopKeys.all, 'employee-dashboard'] as const,
  employeeDash: (shopId: string) => [...shopKeys.employeeDashboard(), shopId] as const,
};

export const shopQueries = {
  dashboard: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.dashboard(shopId),
      queryFn: () => getShopDashboardFn({ data: { shopId } }),
    }),
  employees: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.employeeList(shopId),
      queryFn: () => getShopEmployeesFn({ data: { shopId } }),
    }),
  myInvitations: () =>
    queryOptions({
      queryKey: shopKeys.myInvitations(),
      queryFn: () => getMyInvitationsFn(),
    }),
  employeeDashboard: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.employeeDash(shopId),
      queryFn: () => getEmployeeDashboardFn({ data: { shopId } }),
    }),
};
