import React, { useState } from 'react';
import { useProfile } from './useProfile';
import ProfileForm from './ProfileForm';
import AuditLogList from './AuditLogList';
import { User } from '@/types';
import { useAuth } from '@/useAuth';
import { User as UserIcon, Shield, MapPin, Clock, Edit3, LogOut, Activity, Mail } from 'lucide-react';



export default function ProfilePage() {
  const { profile, isProfileLoading, auditLogs, isAuditLogsLoading } = useProfile();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isProfileLoading || !profile) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safety helper for rendering potentially complex fields
  const renderField = (value: any) => {
    if (value === null || value === undefined) return '--';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-24 h-24 rounded-2xl border border-gray-200 object-cover shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <UserIcon size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{profile.name}</h1>
            <p className="text-gray-500 font-medium tracking-wide">
              {profile.role.toUpperCase()} • {profile.companyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Edit3 size={16} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-600 font-bold text-sm transition-all flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isEditing ? (
          <div className="col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b">Update Information</h2>
            <ProfileForm profile={profile} onSave={() => setIsEditing(false)} />
          </div>
        ) : (
          <>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm group hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><UserIcon size={20} /></div>
                <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Full Name</span>
                  <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Organization</span>
                  <p className="text-lg font-semibold text-gray-800">{profile.companyName || 'Freelance'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</span>
                  <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Status</span>
                  <div className="mt-1">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Active {profile.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm group hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><MapPin size={20} /></div>
                <h3 className="text-lg font-bold text-gray-900">Work Context</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Office Location</span>
                  <p className="text-lg font-semibold text-gray-800">{renderField(profile.office_location)}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Working Hours</span>
                  <p className="text-lg font-semibold text-gray-800">{renderField(profile.working_hours)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {!isEditing && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Activity size={20} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Activity Stream</h2>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {isAuditLogsLoading ? (
              <div className="p-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <AuditLogList logs={auditLogs} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}