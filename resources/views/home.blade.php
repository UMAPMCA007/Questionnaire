@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}
                    {{-- start test button --}}
                    <a href="{{route('assessment')}}" class="col-md-2 offset-md-5 btn btn-primary">Start Test</a>
                    {{-- end test button --}}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
