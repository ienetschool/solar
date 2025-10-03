import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Clock, CheckCircle, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Callback {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function CallbacksPage() {
  const { toast } = useToast();
  const [selectedCallback, setSelectedCallback] = useState<Callback | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: callbacks = [], isLoading } = useQuery<Callback[]>({
    queryKey: ["/api/callbacks"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/callbacks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/callbacks"] });
      toast({
        title: "Status updated",
        description: "Callback status has been updated successfully",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleViewDetails = (callback: Callback) => {
    setSelectedCallback(callback);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Callback Requests</h1>
          <p className="text-muted-foreground">Loading callback requests...</p>
        </div>
      </div>
    );
  }

  const pendingCallbacks = callbacks.filter((cb) => cb.status === "pending");
  const completedCallbacks = callbacks.filter((cb) => cb.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Callback Requests</h1>
        <p className="text-muted-foreground">
          Manage and respond to customer callback requests
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Callbacks</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCallbacks.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting contact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCallbacks.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callbacks.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Callback Requests</CardTitle>
          <CardDescription>
            View and manage all customer callback requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {callbacks.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No callback requests yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Preferred Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callbacks.map((callback) => (
                  <TableRow key={callback.id}>
                    <TableCell className="font-medium" data-testid={`callback-name-${callback.id}`}>
                      {callback.name}
                    </TableCell>
                    <TableCell data-testid={`callback-phone-${callback.id}`}>
                      {callback.phone}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {callback.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(callback.status)}</TableCell>
                    <TableCell>
                      {new Date(callback.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(callback)}
                          data-testid={`button-view-${callback.id}`}
                        >
                          View
                        </Button>
                        {callback.status === "pending" && (
                          <Select
                            value={callback.status}
                            onValueChange={(value) => handleStatusChange(callback.id, value)}
                          >
                            <SelectTrigger className="w-[130px]" data-testid={`select-status-${callback.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Callback Request Details</DialogTitle>
            <DialogDescription>
              View detailed information about this callback request
            </DialogDescription>
          </DialogHeader>
          {selectedCallback && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{selectedCallback.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{selectedCallback.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p className="text-sm text-muted-foreground">{selectedCallback.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Preferred Time</label>
                <p className="text-sm text-muted-foreground">{selectedCallback.preferredTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <p className="text-sm text-muted-foreground">{selectedCallback.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-1">{getStatusBadge(selectedCallback.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Created At</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedCallback.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
