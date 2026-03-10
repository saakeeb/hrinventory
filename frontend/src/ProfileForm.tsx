import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import { useProfile } from './useProfile';
import { useAuth } from '@/useAuth';
import { User as UserIcon, MapPin, Clock, Image as ImageIcon, Save, X, Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  office_location: z.string().optional().nullable(),
  working_hours: z.string().optional().nullable(),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: User;
  onSave: () => void;
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const { user } = useAuth();
  const { updateProfile, isUpdatingProfile, updateProfileError } = useProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      office_location: profile.office_location || '',
      working_hours: typeof profile.working_hours === 'string' ? profile.working_hours : '',
      avatar: profile.avatar || '',
    },
  });

  const isWorker = user?.role === 'worker';

  const onSubmit = (data: ProfileFormInputs) => {
    // Filter out empty strings to send them as null
    const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
    updateProfile(payload, {
      onSuccess: () => {
        onSave();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
          <UserIcon size={14} className="text-indigo-600" />
          <span>Full Identity Name</span>
        </label>
        <input 
          type="text" 
          {...register('name')} 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider animate-shake">{errors.name.message}</p>}
      </div>
      
      {/* Location Field */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
          <MapPin size={14} className="text-purple-600" />
          <span>Assigned Office Location</span>
        </label>
        <input 
          type="text" 
          {...register('office_location')} 
          disabled={isWorker} 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-semibold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="e.g. New York, Floor 4"
        />
        {isWorker && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Restricted to Administrators</p>}
        {errors.office_location && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider animate-shake">{errors.office_location.message}</p>}
      </div>

      {/* Time/Hours Field */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
          <Clock size={14} className="text-blue-600" />
          <span>Working Bandwidth (e.g., 8 am to 5 pm)</span>
        </label>
        <input 
          type="text" 
          {...register('working_hours')} 
          disabled={isWorker} 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="e.g. 9 am to 6 pm"
        />
        {errors.working_hours && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider animate-shake">{errors.working_hours.message}</p>}
      </div>

      {/* Avatar Field */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
          <ImageIcon size={14} className="text-indigo-600" />
          <span>Avatar Image URL</span>
        </label>
        <input 
          type="text" 
          {...register('avatar')} 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          placeholder="https://..."
        />
        {errors.avatar && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider animate-shake">{errors.avatar.message}</p>}
      </div>

      {updateProfileError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center space-x-3 text-red-600 animate-in fade-in zoom-in duration-300">
          <Shield size={18} />
          <span className="text-sm font-bold uppercase tracking-tight">{updateProfileError.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onSave} 
          className="px-6 py-3 text-gray-500 hover:text-gray-900 font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          Discard Changes
        </button>
        <button 
          type="submit" 
          disabled={isUpdatingProfile} 
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center space-x-3"
        >
          {isUpdatingProfile ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Deploy Updates</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}