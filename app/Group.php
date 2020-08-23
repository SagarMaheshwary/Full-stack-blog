<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /** 
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Permissions belonging to this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions()
    {
        return $this->belongsToMany(
            'App\Permission',
            'group_permission_mappings',
            'group_id',
            'permission_id'
        );
    }
}
