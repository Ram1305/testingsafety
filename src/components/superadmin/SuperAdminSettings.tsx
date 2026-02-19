import { useState } from 'react';
import { Settings, Save, Mail, Bell, Shield, Database, Globe, Palette, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export function SuperAdminSettings() {
  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.skillcert.com',
    smtpPort: '587',
    smtpUser: 'noreply@skillcert.com',
    smtpPassword: '••••••••',
    fromName: 'SkillCert Institute',
    fromEmail: 'noreply@skillcert.com'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    certificateExpiry: true,
    paymentReminders: true,
    courseUpdates: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    ipWhitelisting: false
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'SkillCert Institute',
    siteUrl: 'https://skillcert.com',
    maintenanceMode: false,
    registrationEnabled: true,
    apiRateLimit: '1000',
    maxUploadSize: '10'
  });

  const handleSaveEmailSettings = () => {
    toast.success('Email settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully!');
  };

  const handleSaveSystem = () => {
    toast.success('System settings saved successfully!');
  };

  const handleTestEmail = () => {
    toast.success('Test email sent successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-600" />
                General System Settings
              </CardTitle>
              <CardDescription>Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={systemSettings.siteUrl}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={systemSettings.apiRateLimit}
                    onChange={(e) => setSystemSettings({ ...systemSettings, apiRateLimit: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={systemSettings.maxUploadSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxUploadSize: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Temporarily disable access for all users</div>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked: boolean) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Student Registration</div>
                    <div className="text-sm text-gray-500">Allow new students to register</div>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked: boolean) => setSystemSettings({ ...systemSettings, registrationEnabled: checked })}
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveSystem}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-violet-600" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings for outgoing emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEmailSettings}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleTestEmail}
                  variant="outline"
                >
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure system-wide notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">Email Notifications</div>
                        <div className="text-sm text-gray-500">Send notifications via email</div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-sm text-gray-500">Send notifications via SMS</div>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">Push Notifications</div>
                        <div className="text-sm text-gray-500">Send browser push notifications</div>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">Certificate Expiry Alerts</div>
                        <div className="text-sm text-gray-500">Notify before certificates expire</div>
                      </div>
                      <Switch
                        checked={notificationSettings.certificateExpiry}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, certificateExpiry: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">Payment Reminders</div>
                        <div className="text-sm text-gray-500">Send payment reminder notifications</div>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentReminders}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, paymentReminders: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                      <div>
                        <div className="font-medium text-gray-900">Course Updates</div>
                        <div className="text-sm text-gray-500">Notify about course changes</div>
                      </div>
                      <Switch
                        checked={notificationSettings.courseUpdates}
                        onCheckedChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, courseUpdates: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveNotifications}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                Security Configuration
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                  <div>
                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Require 2FA for all admin accounts</div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-violet-100">
                  <div>
                    <div className="font-medium text-gray-900">IP Whitelisting</div>
                    <div className="text-sm text-gray-500">Restrict access to specific IP addresses</div>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelisting}
                    onCheckedChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, ipWhitelisting: checked })}
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveSecurity}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
