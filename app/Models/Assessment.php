<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;
    protected $table='assessments';
    protected $fillable = [
        'section_id',
        'section_name',
    ];
}
